pipeline {
	agent any
	
	stages {
		stage('build') {
			steps {
				sh 'node -v'
				sh 'npm install'
			}
		},
		stage('test') {
			steps {
				sh 'npm run test'
			}
		}
	}
}
