pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "abhirambsn"
        IMAGE_NAME = "sample-api"
        REGISTRY_CREDENTIALS = "dockerhub-creds"
        GIT_CREDENTIALS = "github-creds"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/abhirambsn/sample-api.git',
                        credentialsId: GIT_CREDENTIALS
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                    sh "docker build -t $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: REGISTRY_CREDENTIALS,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                    sh "docker push $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG"
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    sh """
                    sed -i 's|image: .*|image: $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG|' k8s/deployment.yaml
                    """
                }
            }
        }

        stage('Commit & Push Updated Manifest') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: GIT_CREDENTIALS,
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh """
                    git config user.email "jenkins@jenkins.local"
                    git config user.name "Jenkins"
                    git commit -am "Update image to tag $IMAGE_TAG" || true
                    git push https://$GIT_USER:$GIT_PASS@github.com/abhirambsn/sample-api.git main
                    """
                }
            }
        }
    }
}
