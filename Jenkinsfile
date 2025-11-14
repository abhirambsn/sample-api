pipeline {
    agent {
        kubernetes {
            label 'kaniko'
            defaultContainer 'kaniko'
        }
    }

    environment {
        DOCKERHUB = "abhirambsn"
        IMAGE = "sample-api"
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

        stage('Build & Push Docker Image') {
            steps {
                container('kaniko') {
                    script {
                        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                        sh """
                        /kaniko/executor \
                          --context `pwd`/api \
                          --dockerfile `pwd`/api/Dockerfile \
                          --destination=$DOCKERHUB/$IMAGE:$IMAGE_TAG \
                          --cache=true
                        """
                    }
                }
            }
        }

        stage('Update Deployment Manifest') {
            steps {
                sh """
                sed -i 's|image:.*|image: $DOCKERHUB/$IMAGE:${IMAGE_TAG}|' k8s/deployment.yaml
                """
            }
        }

        stage('Commit and Push Changes') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: GIT_CREDENTIALS,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    git config user.email "jenkins@example.com"
                    git config user.name "Jenkins"
                    git commit -am "Update image tag to ${IMAGE_TAG}" || true
                    git push https://${USER}:${PASS}@github.com/abhirambsn/sample-api.git main
                    """
                }
            }
        }
    }
}
