# usof_backend

<h2 id="req"> Requirements</h2>
<ul>
    <li>MySQL 8.0.30</li>
    <li>Node.js 16.17.0 (npm 8.15.0)</li>
</ul>

<h2> Hosting the API</h2>
<p><b>To host the API just follow these steps:</b></p>
<ol>
    <li><a href="#req">Install the latest versions of the programs specified in the requirements</a></li>
    <li>Open folder in your terminal and run <code>npm install</code></li>
    <li>Create your database</li>
    <li>Create <code>.env</code> file and fill it with your data accordingly to <code>.env.example</code> file (specify your gmail mail address from which messages will be sent to registered users, and a password that can be obtained by two-factor authorization of your Google account and then adding the device from which you plan to send messages to the "Application passwords" section)</li>
    <li>Run <code></code> to fill database with required tables</li>
    <li>Start the API server with <code>node index.js</code></li>
</ol>

<h2>Using the API</h2>
You can send API requests from your JS file using fetch or with Postman!</p>
<p>
    <b>Here's list of possible user API requests:</b>
    <br>
    <p><b>Authorization module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Register</td>
                <td><code>POST - /api/auth/register</code></td>
                <td>json data (login, psw, repeatpsw, fname, email)</td>
            </tr>
            <tr>
                <td>Login</td>
                <td><code>POST - /api/auth/login</code></td>
                <td>json data (login, psw)</td>
            </tr>
            <tr>
                <td>Log out</td>
                <td><code>POST - /api/auth/logout</code></td>
                <td></td>
            </tr>
            <tr>
                <td>Forgot password</td>
                <td><code>POST - /api/auth/password-reset</code></td>
                <td>json data (login)</td>
            </tr>
            <tr>
                <td>Reset password</td>
                <td><code>POST - /api/auth/password-reset/token</code></td>
                <td>json data (newpsw, repeatnewpsw)</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>User module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all users</td>
                <td><code>GET - /api/users</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show specific user</td>
                <td><code>GET - /api/users/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Create user by admin</td>
                <td><code>POST - /api/users</code></td>
                <td>token, json data (login, psw, repeatpsw, fname, email)</td>
            </tr>
            <tr>
                <td>Change users avatar</td>
                <td><code>PATCH - /api/users/avatar</code></td>
                <td>token, json data</td>
            </tr>
            <tr>
                <td>Change current user data</td>
                <td><code>PATCH - /api/users/:id</code></td>
                <td>token, json data (login, psw, repeatpsw, fname, email)</td>
            </tr>
            <tr>
                <td>Delete specific user</td>
                <td><code>DELETE - /api/users/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Refresh token</td>
                <td><code>POST - /api/auth/refresh-tokens</code></td>
                <td>token</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Post module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all posts</td>
                <td><code>GET - /api/posts</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show favorites posts by current user</td>
                <td><code>GET - /api/posts/favorites</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Add post to favorites posts by current user</td>
                <td><code>POST - /api/posts/:id/favorites</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Delete post from favorites posts by current user</td>
                <td><code>DELETE - /api/posts/favorites/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show subscriptions posts by current user</td>
                <td><code>GET - /api/posts/subscriptions</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Add post to subscriptions posts by current user</td>
                <td><code>POST - /api/posts/:id/subscriptions</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Delete post from subscriptions posts by current user</td>
                <td><code>DELETE - /api/posts/subscriptions/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show specific post</td>
                <td><code>GET - /posts/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show comments by specific post</td>
                <td><code>GET - /posts/:id/comments</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Create comment specific post by current user</td>
                <td><code>POST - /posts/:id/comments</code></td>
                <td>token, json data (content)</td>
            </tr>
            <tr>
                <td>Show categories by specific post</td>
                <td><code>GET - /posts/:id/categories</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show likes by specific post</td>
                <td><code>GET - /posts/:id/like</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Create post by current user</td>
                <td><code>POST - /posts/</code></td>
                <td>token, json data (title, content, categories)</td>
            </tr>
            <tr>
                <td>Like post by current user</td>
                <td><code>POST - /posts/:id/like</code></td>
                <td>token, json data (type)</td>
            </tr>
            <tr>
                <td>Change post by current user</td>
                <td><code>PATCH - /posts/:id</code></td>
                <td>token, json data (user: title, content, categories; admin: status)</td>
            </tr>
            <tr>
                <td>Delete specific post by current user</td>
                <td><code>DELETE - /posts/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Delete like specific post by current user</td>
                <td><code>DELETE - /posts/:id/like</code></td>
                <td>token</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Categories module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show all categories</td>
                <td><code>GET - /api/categories</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show specific category</td>
                <td><code>GET - /api/categories/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show all posts by category</td>
                <td><code>GET - /api/categories/:id/posts</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Create new category</td>
                <td><code>POST - /api/categories</code></td>
                <td>token, json data (title, description)</td>
            </tr>
            <tr>
                <td>Change specific category</td>
                <td><code>PATCH - /api/categories/:id</code></td>
                <td>token, json data (title, description)</td>
            </tr>
            <tr>
                <td>Delete specific category</td>
                <td><code>DELETE - /api/categories/:id</code></td>
                <td>token</td>
            </tr>
        </table>
    </p>
    <br>
    <p><b>Comments module</b>
        <table width="100%">
            <thead>
                <tr>
                    <td><b>Action</b></td>
                    <td><b>Request</b></td>
                    <td><b>Requirements</b></td>
                </tr>
            </thead>
            <tr>
                <td>Show specific comment</td>
                <td><code>GET - /api/comments/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Show likes by specific comment</td>
                <td><code>GET - /api/comments/:id/like</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Like comment by current user</td>
                <td><code>POST - /api/comments/:id/like</code></td>
                <td>token, json data (type)</td>
            </tr>
            <tr>
                <td>Change specific comment</td>
                <td><code>PATCH - /api/comments/:id</code></td>
                <td>token, json data (content)</td>
            </tr>
            <tr>
                <td>Delete specific comment</td>
                <td><code>DELETE - /api/comments/:id</code></td>
                <td>token</td>
            </tr>
            <tr>
                <td>Delete like specific comment</td>
                <td><code>DELETE - /api/comments/:id/like</code></td>
                <td>token</td>
            </tr>
        </table>
    </p>
    
<h2>Have a good day!</h2>