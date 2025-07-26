provider "aws" {
  region = var.aws_region
}

resource "aws_elasticache_subnet_group" "ques" {
  name       = "ques-subnet-group"
  subnet_ids = var.subnet_ids
}

resource "aws_elasticache_cluster" "ques" {
  cluster_id           = "ques-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  subnet_group_name    = aws_elasticache_subnet_group.ques.id
  parameter_group_name = "default.redis6.x"
}
