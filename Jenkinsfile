pipeline {
    agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        // DOCKERHUB_USERNAME = "hazemfelhi"
        APP_NAME = "Agency_Project"
        IMAGE_REG = "hazemfelhi"
        IMAGE_TAG = "v6"
        IMAGE_REPO1 = "creator"
        IMAGE_REPO2 = "brand"
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${APP_NAME}"
        REGISTER_CREDS = 'dockerhub'
        SCANNER_HOME = tool 'sonarqube'
        SNYK_INSTALLATION = 'snyk'
        SNYK_TOKEN = 'snyk'
        TRIVY_OUTPUT = "trivy_report.json"
        TRIVY_CACHE_DIR = "/var/lib/jenkins/trivy-cache"
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
        stage('Prepare Cache Directory') {
            steps {
                script {
                    // Ensure cache directory has correct permissions
                    sh 'sudo mkdir -p $TRIVY_CACHE_DIR'
                    sh 'sudo chown -R jenkins:jenkins $TRIVY_CACHE_DIR'
                    sh 'sudo chmod -R 777 $TRIVY_CACHE_DIR'
                }
            }
        }
        stage('Scan with Trivy') {
            steps {
                script {
                    // Pull the Trivy image
                    sh 'docker pull aquasec/trivy:latest'
                    
                    // Run Trivy scan with explicit cache directory inside container
                    sh """
                    docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        -v $TRIVY_CACHE_DIR:/root/.cache/ \
                        aquasec/trivy:latest image --cache-dir /root/.cache/ --format json --exit-code 1 $IMAGE_REG/$IMAGE_REPO1:$IMAGE_TAG > $TRIVY_OUTPUT
                    """
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy_report.json', allowEmptyArchive: true
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

