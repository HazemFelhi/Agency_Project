pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        // DOCKERHUB_USERNAME = "hazemfelhi"
        APP_NAME = "Agency_Project"
        IMAGE_REG = "hazemfelhi"
        IMAGE_TAG = "v1"
        IMAGE_REPO1 = "creator"
        IMAGE_REPO2 = "brand"
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${APP_NAME}"
        REGISTER_CREDS = 'dockerhub'
        SCANNER_HOME = tool 'sonarqube'
        SNYK_INSTALLATION = 'snyk'
        SNYK_TOKEN = 'snyk'
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
                    git(
                        credentialsId: 'github',
                        url: 'https://github.com/HazemFelhi/Agency_Project.git',
                        branch: 'main'
                    )
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=Agency_Project \
                        -Dsonar.projectName=Agency_Project \
                        -Dsonar.projectVersion=1.0
                    """
                }
            }
        }
        // stage('Quality Gate') {
        //     steps {
        //         script {
        //             // Wait for SonarQube analysis to complete and get the quality gate status
        //             def qg = waitForQualityGate()
        //             if (qg.status != 'OK') {
        //                 error "Pipeline aborted due to quality gate failure: ${qg.status}"
        //             } else {
        //                 echo 'Analysis fine'
        //             }
        //         }
        //     }
        // }
        stage('snyk_analysis') {
            steps {
                script {
                    echo 'Testing...'
                    try {
                        snykSecurity(
                            snykInstallation: SNYK_INSTALLATION,
                            snykTokenId: SNYK_TOKEN,
                            failOnIssues: false,
                            monitorProjectOnBuild: true,
                            additionalArguments: '--all-projects --d'
                        )
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error("Error during snyk_analysis: ${e.message}")
                    }
                }
            }
        }
        // stage('Install Dependencies') {
        //     steps {
        //         dir('/var/lib/jenkins/workspace/Jenkins_CI/Creators') {
        //             sh 'npm install'
        //         }
        //         dir('/var/lib/jenkins/workspace/Jenkins_CI/Brands') {
        //             sh 'npm install'
        //         }
        //     }
        // }
        stage('Build Docker Images') {
            steps {
                sh "docker build -t $IMAGE_REPO1 ./Creators"
                sh "docker build -t $IMAGE_REPO2 ./Brands"
                sh "docker tag $IMAGE_REPO1 $IMAGE_REG/$IMAGE_REPO1:$IMAGE_TAG"
                sh "docker tag $IMAGE_REPO2 $IMAGE_REG/$IMAGE_REPO2:$IMAGE_TAG"
            }
        }
        stage('Scan with Trivy') {
            steps {
                script {
                    // Pull the Trivy Docker image
                    sh 'docker pull aquasec/trivy:latest'

                    // Run Trivy scan on the target Docker image
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image $IMAGE_REG/$IMAGE_REPO1:$IMAGE_TAG"
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image $IMAGE_REG/$IMAGE_REPO2:$IMAGE_TAG"
                }
            }
        }
        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh "docker login -u $USERNAME -p $PASSWORD"
                    sh "docker push $IMAGE_REG/$IMAGE_REPO1:$IMAGE_TAG"
                    sh "docker push $IMAGE_REG/$IMAGE_REPO2:$IMAGE_TAG"
                }
            }
        }
    }
    // post {
    //     always {
    //         // Clean up workspace and remove Docker images
    //         cleanWs()
    //         sh 'docker system prune -af'
    //     }

    //     success {
    //         echo 'Pipeline completed successfully!'
    //     }

    //     failure {
    //         echo 'Pipeline failed.'
    //     }
    // }
}

