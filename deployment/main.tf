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

# define an ECS cluster for quicktype
resource "aws_ecs_cluster" "quicktype-frontend-cluster" {
  name = "quicktype-frontend-cluster"
}

# define a task for the frontend webserver
resource "aws_ecs_task_definition" "quicktype-frontend-task-definition" {
  family                   = "quicktype-frontend-task-definition"
  task_role_arn            = "arn:aws:iam::800636676873:role/ecsTaskExecutionRole"
  execution_role_arn       = "arn:aws:iam::800636676873:role/ecsTaskExecutionRole"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512

  container_definitions = jsonencode([
    {
      name      = "quicktype-frontend-container"
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

# define a service, running 5 instances of the frontend webserver
resource "aws_ecs_service" "quicktype-frontend-service" {
  name                   = "quicktype-frontend-service"
  enable_execute_command = true
  launch_type            = "FARGATE"
  cluster                = aws_ecs_cluster.quicktype-frontend-cluster.id
  task_definition        = aws_ecs_task_definition.quicktype-frontend-task-definition.id
  desired_count          = 5
  network_configuration {
    subnets          = ["subnet-04543979c75187933"]
    security_groups  = ["sg-0d4fb5f077b4a953d"]
    assign_public_ip = true
  }
}

# define a load balancer
resource "aws_lb" "quicktype-frontend-lb" {
  name               = "quicktype-frontend-lb"
  internal           = false
  ip_address_type    = "ipv4"
  load_balancer_type = "application"
  security_groups    = ["sg-0d4fb5f077b4a953d"]
  subnets = ["subnet-00da83bc2f50636db","subnet-01524a7fe6bf7c90d","subnet-04543979c75187933","subnet-045fa5fa8fb035456","subnet-088a21ebe1445fd7d","subnet-0aff7575a5132c4d9"]
}

# define a listener
resource "aws_lb_listener" "alb-listener" {
  load_balancer_arn = "arn:aws:elasticloadbalancing:us-east-1:800636676873:loadbalancer/app/quicktype-frontend-lb/9ceb532550000d9a"
  port              = 443
  protocol          = "HTTP"
  default_action {
    target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:800636676873:targetgroup/quicktype-frontend-tg/09fff9b54d39cbb5"
    type             = "forward"
  }
}