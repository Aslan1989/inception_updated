NAME = inception

COMPOSE = docker compose -f srcs/docker-compose.yml

DATA = /home/aisaev/data

all:
	mkdir -p $(DATA)/mariadb $(DATA)/wordpress
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down -v

clean:
	docker system prune -af

fclean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

re: fclean all

.PHONY: all down clean fclean re