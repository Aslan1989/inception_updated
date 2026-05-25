NAME = inception

COMPOSE = docker compose -f srcs/docker-compose.yml

all:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

clean:
	docker system prune -af

fclean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

re: fclean all