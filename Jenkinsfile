pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        DOCKERHUB_USERNAME = "hazemfelhi"
        APP_NAME = "Agency_Project"
        IMAGE_TAG = "${BUILD_NUMBER}"
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${APP_NAME}"
        REGISTER_CREDS = 'dockerhub'
        SCANNER_HOME = tool 'sonarqube'
    }
    stages {
        stage("CleanUp Workspace") {
            steps {
                script {
                    cleanWs()
                }
            }
        }
        stage("Checkout SCM") {
            steps {
                script {
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
                withSonarQubeEnv(installationName: 'sonarqube', credentialsId: 'sonarCreds') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=Agency_Project \
                        -Dsonar.projectName=Agency_Project \
                        -Dsonar.projectVersion=1.0"
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    // Wait for SonarQube analysis to complete and get the quality gate status
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                    }
                }
            }
        }
    }
}
