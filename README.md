# ATLAS DESTINATIONS

Página web que junto a web-scrapping, llamadas a APIs y una BD, recopila información sobre monumentos, lugares o sitios de interés según el destino que se indique, además de otros datos como el país al que pertenece, imágenes, descripción, coordenadas, categorías, temperatura, etc.



MongoDB, backend con node+express, 
frontend con html+css+js (servido por nginx),
webscraping en python y se conecta a mongodb con pymongo.
Todo en contenedores docker para no tener que instalar ni configurar.


### Proceso de instalación
En el host remoto hay que:
1. Clonar el repositorio
2. Instalar docker
3. sudo docker-compose up --build
4. pip3 install pymongo
5. python3 webscraping.py
