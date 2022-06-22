# GitHub-Wrapper-API

### Steps to run the project

1. run: git clone https://github.com/JashanPuri/cometlabs-assignment.git (To clone the repo)
2. run: npm install (to install all the packages mentioned in package.json)
3. run: npm start (the server will start running on port 3000 by default)
4. open postman and test

### Authentication
For making requests to this API, GitHub personal access token should be included in Authorization header.

The format of the Authorization header will be: { Authorization: "Bearer personal-access-token" }
  
You can create your personal access token with the help of this link https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

### API Endpoints

1. GET /api/v1/repos - Get repos for user with appropiate option with filters via query params included.

    Query Params:
    - username : name for user to get repos. if not provided repos of authenticated user will be listed
    - affiliation : values accepted = owner, collaborator, member. can be passed as a list of comma-seperated values. default = owner
    - filters : filters for number of stars and forks. example - filters=stars>=5&forks>=5. double equal-to sign for equality.

2. POST /api/v1/repos - Create a repo for authenticated user.

    Request Body:
    - name : name of repository (required)
    - description : description for repository (optional)
    - private : private repo or not (optional, defualt=true)

3. GET /api/v1/repos/{repoName}/contributors - Get repository contributors

    Path Params:
    - repoName : name for the repo. (required)

    Query Params:
    - username : name for owner of repo. if not provided repos of authenticated user will be listed.

4. GET /api/v1/repos/{repoName}/stargazers - Get repository stargazers

    Path Params:
    - repoName : name for the repo. (required)

    Query Params:
    - username : name for owner of repo. if not provided repos of authenticated user will be listed.

5. GET /api/v1/repos/{repoName}/topics - Get repository topics

    Path Params:
    - repoName : name for the repo. (required)

    Query Params:
    - username : name for owner of repo. if not provided repos of authenticated user will be listed.

6. PUT /api/v1/repos/{repoName}/topics - Update repository topics

    Path Params:
    - repoName : name for the repo. (required)

    Query Params:
    - username : name for owner of repo. if not provided repos of authenticated user will be listed.

7. DELETE /api/v1/repos/{repoName}/topics - Delete repository topics

    Path Params:
    - repoName : name for the repo. (required)

    Query Params:
    - username : name for owner of repo. if not provided repos of authenticated user will be listed.

8. GET /api/v1/stargazers - Get stargazers who have started exactly a certain number of repos of a given user.

    Query Params:
    - username : name for user to get repos. if not provided repos of authenticated user will be listed
    - filters : filters for number of repos stars by each stargazer. example - filters=stars>=2 OR filters=stars==2 . double equal-to sign for equality.

9. GET /api/v1/repos/filter-with-commits - Get repos for user with appropiate option with filters based on commits via query params.

    Query Params:
    - username : name for user to get repos. if not provided repos of authenticated user will be listed
    - affiliation : values accepted = owner, collaborator, member. can be passed as a list of comma-seperated values. default = owner
    - filters : filters for number of commits. example - filters=commits>=5 . double equal-to sign for equality.
    - byOwner : boolean to indicate that commits to count should by made by owner only or not.
    - days : number of days since the commits should be counted. days=10 means commits of last '10' days

### Steps to run postman collection

Attached is a postman collection for above mentioned end points - GitHub-Wrapper-API Collection.postman_collection.json

Import the collection to postman.

Set the following environment variables:
1. URL - localhost:localhost:3000/api/v1
