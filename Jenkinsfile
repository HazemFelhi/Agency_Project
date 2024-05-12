pipeline{

    agent any

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
    }
}

//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