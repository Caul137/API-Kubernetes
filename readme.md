## 🚀 Desafio Kubernetes: API Node.js & MySQL com HPA

Este projeto demonstra a implantação de uma infraestrutura escalável no Kubernetes (Kind), envolvendo uma API bem simples em Node.js, um banco de dados MySQL com persistência de dados(pv,pvc) e auto-escalonamento(HPA).

Como ferramenta de vizualização eu utilizei o LENS

---

### 🛠️ Tecnologias Utilizadas

- Kubernetes (Kind)

- LENS

- Docker

- Node.js - EXPRESS

- MySQL 8.0

---


 ### 🔓  Requisitos para rodar:

- [x] Ter o **node** instalado
    Caso não tenha, voCê pode baixa-lo por aqui: https://nodejs.org/pt-br
- [X] Ter o **kind**  instalado
     Caso não tenha, voCê pode baixa-lo por aqui: https://kind.sigs.k8s.io/docs/user/quick-start/
- [X] Ter o **kubectl**  instalado
     Caso não tenha, voCê pode baixa-lo por aqui: https://kubernetes.io/docs/tasks/tools/
- [X] Ter o **LENS** ou algum visualizador(IDE) para o k8s instalado
     Caso não tenha, voCê pode baixa-lo por aqui: https://lenshq.io
- [X] Ter o **docker**  instalado
     Caso não tenha, voCê pode baixa-lo por aqui: https://www.docker.com/products/docker-desktop/


    **Ou você pode instalar pelo terminal via Chocolatey para windows/brew:**
        ``choco install nodejs kind kubernetes-cli docker-desktop lens -y``

---

### 🏗️ Arquitetura do Projeto

O projeto está dividido em dois Namespaces:

**desafio-db:** Contém o MySQL, Secrets, ConfigMaps e volumes (PV/PVC);

**desafio-api:** Contém a API Node.js e o HPA;


---
📁 **Estrutura**

├── k8s/
│   
├── src/
│   └── index.js
│  
├── .dockerignore  
├── .dockerfile
├── .gitignore
└── readme


---

### 🗜 Configuração

- Faça o build da imagem: **docker build -t nome-da-imagem .**;

- Carregue ela no cluster: **kind load docker-image api-kube:v2 --name seu-cluster**;

- Entre na pasta **/k8s** e rode o **kubectl apply -f .**;

- Configuração do banco:
    - O banco irá se iniciar com uma senha vazia, entre nele e defina uma (A usada nos secrets): kubectl exec -it deployment/app-service-db -n desafio-db -- mysql -u root
        
    - Comandos úteis:
        - Verificar conexões: SHOW PROCESSLIST;
        - Criar o banco: CREATE DATABASE IF NOT EXISTS meu_banco;
--
        - Passo a passo:
            **(DEFINE A SENHA DO ROOT)**

            **ALTER USER** 'root'@'localhost' **IDENTIFIED WITH** mysql_native_password BY 'root123';
--
            **(CRIA O ACESSO PARA O ROOT)**

           **CREATE USER IF NOT EXISTS** 'root'@'%' **IDENTIFIED WITH mysql_native_password BY** 'root123';
           **GRANT ALL PRIVILEGES ON** * . * **TO** 'root'@'%' **WITH GRANT OPTION**;

           obs: Não contém espaço entre * . * . Fica assim por conta do markdown, é asterisco , ponto, asterisco, tudo junto;
--
            **(CRIA O BANCO PARA O ConfigMap)**
           ** CREATE DATABASE IF NOT EXISTS** meu_banco;

--
           **(APLICA AS MUDANÇAS)**
            FLUSH PRIVILEGES;
            EXIT;

            **Obs**: não esqueça de colocar ponto virgula no final dos comandos **;**

    - Comandos de monitoramento:
        - **Logs da API**: kubectl logs -l app=app-service-api -n desafio-api

        - **Métricas de Recursos**: kubectl top pod -A

        - **Status do HPA:** kubectl get hpa -n desafio-api

**Obs**: Esta é a forma que encontrei de se conetar, caso haja outra, pode usar. Também pode tentar utilizar algum client para o SQL como o Beekeeper, caso queira.


Para criar uma table e inserir um texto:
-   Entre no banco:
    - USE meu_banco
    - CREATE TABLE IF NOT EXISTS mensagens(
        id INT AUTO_INCREMENT PRIMARY KEY,
        texto VARCHAR(255)
    );

    - INSERT INTO mensagens (texto) VALUES ('Dados persistidos com sucesso');
    - EXIT;

    Após isso, o texto aparecerá no endpoint /dados

---


### 📃 Notas 

    A API só fica Ready 1/1 se a conexão com o banco for bem sucedida;

    Foi utilizado storageClassName: manual para compatibilidade com o ambiente local Kind;
--

    Ao utilizar o comando kubectl logs deployment/app-service-db -n desafio-db --tail=20;
    Eu vi que mysql_native_password é deprecated:
    Plugin mysql_native_password reported: ''mysql_native_password' is deprecated and will be removed
    in a future release. Please use caching_sha2_password instead'

    Então caso queira usar caching_sha2_password para se logar no banco, fique a vontade,
    é até melhor por conta de segurança.
    Basta trocar o método, Ex: 
    ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'root123';

---

### 📘 Aumento de Carga registrados

* Eu rodei: 
* Você pode visualizar o IP do cluster com:
* E verifiquei a HPA com: 
* Peguei os logs com: 
* E após os 2 minutos, pode deletar o pod do fortio: k

---
