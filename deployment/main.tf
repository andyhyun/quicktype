# configures terraform to use the AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

# configures the AWS provider
provider "aws" {
  region = "us-east-1"
}

# adopt the default role created by AWS to run the task under
data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# create a security group
#
# this is used to allow network traffic to reach our containers
resource "aws_security_group" "quicktype_security_group" {
  name = "quicktype-security-group"
  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  ingress {
    from_port        = 8080
    to_port          = 8080
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_subnets" "quicktype_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }
}

data "aws_subnet" "quicktype_subnet" {
  for_each = toset(data.aws_subnets.quicktype_subnets.ids)
  id       = each.value
  depends_on = [
    data.aws_subnets.quicktype_subnets
  ]
}

data "aws_iam_policy_document" "ecs_agent" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_agent" {
  name               = "ecs-agent"
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json
}

resource "aws_iam_role_policy_attachment" "ecs_agent" {
  role       = aws_iam_role.ecs_agent.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_agent" {
  name = "ecs-agent"
  role = aws_iam_role.ecs_agent.name
}

resource "aws_ecs_cluster" "quicktype_cluster" {
  name = "quicktype-cluster"
}

resource "aws_launch_configuration" "quicktype_launch_configuration" {
  name                 = "quicktype-launch-configuration"
  image_id             = "ami-0fe77b349d804e9e6"
  iam_instance_profile = aws_iam_instance_profile.ecs_agent.name
  security_groups      = [aws_security_group.quicktype_security_group.id]
  user_data            = "#!/bin/bash\necho ECS_CLUSTER=quicktype-cluster >> /etc/ecs/ecs.config"
  instance_type        = "t2.micro"
}

resource "aws_autoscaling_group" "quicktype_autoscaling_group" {
  name                 = "quicktype-autoscaling-group"
  vpc_zone_identifier  = [for s in data.aws_subnet.quicktype_subnet : s.id]
  launch_configuration = aws_launch_configuration.quicktype_launch_configuration.name

  desired_capacity          = 1
  min_size                  = 0
  max_size                  = 1
  health_check_grace_period = 300
  health_check_type         = "EC2"
}

# define a task for the frontend webserver
resource "aws_ecs_task_definition" "quicktype_frontend_task_definition" {
  family                   = "quicktype-frontend-task-definition"
  task_role_arn            = data.aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = 256
  memory                   = 256

  container_definitions = jsonencode([
    {
      name      = "quicktype-frontend"
      image     = "800636676873.dkr.ecr.us-east-1.amazonaws.com/quicktype-frontend"
      essential = true
      command   = ["nginx", "-g", "daemon off;"]
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# define a task for the backend
resource "aws_ecs_task_definition" "quicktype_backend_task_definition" {
  family                   = "quicktype-backend-task-definition"
  task_role_arn            = data.aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = 256
  memory                   = 256

  container_definitions = jsonencode([
    {
      name      = "quicktype-backend"
      image     = "800636676873.dkr.ecr.us-east-1.amazonaws.com/quicktype-backend"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
    }
  ])
}

# create a load balancer to distribute traffic to the tasks described below
resource "aws_lb" "quicktype_lb" {
  name               = "quicktype-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.quicktype_security_group.id]
  subnets            = [for s in data.aws_subnet.quicktype_subnet : s.id]
}

# create a frontend target group for the load balancer described above
resource "aws_lb_target_group" "quicktype_frontend_lb_target_group" {
  name        = "quicktype-frontend-lb-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default_vpc.id
  target_type = "instance"
  health_check {
    port = 80
  }
  depends_on = [
    aws_lb.quicktype_lb
  ]
}

# create a backend target group for the load balancer described above
resource "aws_lb_target_group" "quicktype_backend_lb_target_group" {
  name        = "quicktype-backend-lb-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default_vpc.id
  target_type = "instance"
  health_check {
    path = "/api/test"
    port = 8080
  }
  depends_on = [
    aws_lb.quicktype_lb
  ]
}

# An issued certificate for www.quicktype.app
data "aws_acm_certificate" "quicktype_acm_certificate" {
  domain = "www.quicktype.app"
  types  = ["AMAZON_ISSUED"]
}

# load balancer endpoint
resource "aws_lb_listener" "quicktype_lb_listener" {
  load_balancer_arn = aws_lb.quicktype_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.quicktype_acm_certificate.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.quicktype_frontend_lb_target_group.arn
  }
}

# load balancer listener rule for the backend
resource "aws_lb_listener_rule" "quicktype_lb_listener_rule" {
  listener_arn = aws_lb_listener.quicktype_lb_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.quicktype_backend_lb_target_group.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# define a service, running an instance of the frontend webserver
resource "aws_ecs_service" "quicktype_frontend_ecs_service" {
  name                   = "quicktype-frontend-ecs-service"
  enable_execute_command = true
  launch_type            = "EC2"
  cluster                = aws_ecs_cluster.quicktype_cluster.id
  task_definition        = aws_ecs_task_definition.quicktype_frontend_task_definition.id
  desired_count          = 1
  load_balancer {
    target_group_arn = aws_lb_target_group.quicktype_frontend_lb_target_group.arn
    container_name   = "quicktype-frontend"
    container_port   = 80
  }
}

# define a service, running an instance of the backend
resource "aws_ecs_service" "quicktype_backend_ecs_service" {
  name                   = "quicktype-backend-ecs-service"
  enable_execute_command = true
  launch_type            = "EC2"
  cluster                = aws_ecs_cluster.quicktype_cluster.id
  task_definition        = aws_ecs_task_definition.quicktype_backend_task_definition.id
  desired_count          = 1
  load_balancer {
    target_group_arn = aws_lb_target_group.quicktype_backend_lb_target_group.arn
    container_name   = "quicktype-backend"
    container_port   = 8080
  }
}
