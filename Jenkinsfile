pipeline{

    agent any
    tools {
        nodejs 'nodejs'
    }

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
                dir('/var/lib/jenkins/workspace/Jenkins_CI/Creators') {
                    sh 'npm install'
                }
            }
        } 

       
       stage('SonarQube Analysis') {
            steps {
                // Run SonarQube analysis
                withSonarQubeEnv('sonarqube') { // This should match the name of the SonarQube server configuration in Jenkins
                    sh 'sonar-scanner'
                }
            }
        }
        stage('Quality Gate') {
            steps {
                // Wait for SonarQube quality gate result
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Define the path to your Dockerfile
                    def dockerfilePath = 'Agency_Project/Creators/Dockerfile'
                    
                    // Build Docker image using the specified Dockerfile path
                    docker.build("${IMAGE_NAME}", '-f ' + dockerfilePath)
                }
            }
        }
    }
}
