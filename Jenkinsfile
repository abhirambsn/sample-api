pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "abhirambsn"
        IMAGE_NAME = "sample-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abhirambsn/sample-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                    sh "docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG ./api"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
                    sh "docker push $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG"
                }
            }
        }

        stage('Update K8s manifest') {
            steps {
                script {
                    sh """
                    sed -i 's|image: .*|image: $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG|' k8s/deployment.yaml
                    """
                }
            }
        }

        stage('Commit & Push') {
            steps {
                script {
                    sh """
                    git config user.email "jenkins@example.com"
                    git config user.name "Jenkins"
                    git commit -am "Update image tag to $IMAGE_TAG"
                    git push origin main
                    """
                }
            }
        }
    }
}
