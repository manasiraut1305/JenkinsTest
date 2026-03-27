pipeline {
    agent any

    tools {
        nodejs 'node25'
    }

    environment {
    DB_SERVER = "localhost"
    DB_USER = "manasi"
    DB_PASSWORD = "manasi"
    DB_NAME = "NagpurMetro"
    CLIENT_URL = "http://localhost:5173"
}


    stages {

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }
}
