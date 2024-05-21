pipeline{

    agent any
    tools {nodejs "nodejs"}

    environment{
        DOCKERHUB_USERNAME = "hazemfelhi"
        APP_NAME = "Agency_Project"
        IMAGE_TAG = "${BUILD_NUBER}"
        IMAGE_NAME = "${DOCKERHUB_USERNAME}" + "/" + "${APP_NAME}"
        REGISTER_CREDS = 'dockerhub'
    }

    stages{
        stage("CleanUp Workspace"){

            steps{
                script{
                    cleanWs()
                }
            }

        }
        stage("Checkout SCM"){
            steps{
                script{
                    git credentialsId: 'github',
                    url: 'https://github.com/HazemFelhi/Agency_Project.git',
                    branch: 'main'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('/var/lib/jenkins/workspace/Jenkins_CI') {
                    sh 'npm install'
                }
            }
        } 
    
            
        stage('Test') {
            steps {
                sh 'node test'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Define the path to your Dockerfile
                    def dockerfilePath = 'Agency_Project/Brands/Dockerfile'
                    
                    // Build Docker image using the specified Dockerfile path
                    docker.build("${IMAGE_NAME}", '-f ' + dockerfilePath)
                }
            }
        }
    }
}
