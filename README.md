# Configuração para criar uma nova VM:

Ao comprar a VM, uma configuração mínima de 2GB de memória RAM e 1 CPU com núcleo compartilhado já basta:

custom (1 vCPUj, 2 GB de memória)

Muito importante é liberar a porta de http.server (tcp:80) durante a compra da VM. Se não, pode-se liberar ela nas configurações de segurança da VM, liberando a porta 80 no firewall.

O sistema operacional usado foi o Debian 9 (debian-9-stretch-v20180806)

## Preparando ambiente Python na VM1

Para usar as aplicações que dependem de um ambiente Python, primeiramente devemos instalá-lo. Para isso, executaremos os comandos a seguir como usuário com privilégios de administrador:
```
sudo su
```
Após, baixamos e instalamos o python (versão 3) e o gerenciador de pacotes pip:
```
apt install python3 python3-pip
```
E clonamos o repositório do projeto, navegando em seguida para o diretório onde se encontra a aplicação:
```
git clone https://github.com/myreli/compasso-grupo1.git
```
```
cd compasso-grupo1/data_mining/
```
Dentro do diretório, instalamos os pacotes requisitados para executar o script de coleta de Tweets:
```
pip3 install -r requirements.txt
```
E executamos o script:
```
python3 main.py
```
O mesmo pode ser colocado em uma VM e cadastrado no crontab do Debian, onde podemos estabelecer uma tarefa agendada que execute a coleta. O ideal é executa-la uma vez por dia, visto que são coletados apenas os tweets postados até às 23:59 do dia anterior. Ele tem uma abrangência de tempo para coleta de 10 dias a partir do dia atual.

## Preparando ambiente NodeJS na VM2

Para colocar nossa aplicação do projeto no ar, devemos executar na VM um processo do NodeJS que execute indefinidamente. Para isso, instalamos o gerenciador de aplicações do Node (NVM), com privilégios de administrador:
```
sudo su
```
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
É recomendável reiniciar a sessão depois desse último comando. Logo após, instalamos a seguinte versão do NPM, compatível com a nossa aplicação:
```
nvm install 8.11.3
```
Agora clonamos nosso repositório e armazenamos as chaves de acesso aos produtos da Google na aplicação de deploy (GCloud): 
```
git clone https://github.com/myreli/compasso-grupo1.git
```
```
gcloud auth activate-service-account --key-file compasso-grupo1/key/keys-bigquery.json
```
Então vamos para o diretório da aplicação e instalamos as dependências:
```
cd compasso-grupo1/Node/
```
```
npm install
```
E executamos o deploy do projeto, que nos retornará um link em HTTPS que será usado para acessar nossa aplicação: 
```
gcloud app deploy
```
Além de servir para acessar a página da aplicação, o link possuí o endpoint "/apiai", que serve como WeebHook para o Bot DialogFlow.
