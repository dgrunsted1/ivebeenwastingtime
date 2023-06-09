<script>
    import { currentUser, pb } from '/src/lib/pocketbase.js';
  
    let username;
    let password;
    let name;
    let email;

    async function login() {
      const user = await pb.collection('users').authWithPassword(username, password);
    //   console.log({user});
    //   currentUser.set(user);
      console.log({currentUser});
      history.back();
    }
  
    async function signUp() {
        //todo show additional elkement shen signing up
        if (!name && !email){
            let elements = document.getElementsByClassName('signup');
            console.log(elements);
            for (let curr in elements){
                console.log(curr);
                elements[curr].style.display = 'block';
            }
            // elements.forEach((curr) => {
            //     curr.style.display = 'flex';
            // });
            return;
        }
        const data = {
            "username": username,
            "password": password,
            "passwordConfirm": password,
            "name":name,
            "email": email,
            "verified": false
        };  
      try {
        const createdUser = await pb.collection('users').create(data);
        await login();
      } catch (err) {
        for (let key in err.data.data) {
            const element = err.data.data[key];
            let ans = window.prompt(`Re-enter ${key}: ${element.message}`);
            data[key] = ans;
        }
        data.passwordConfirm = data.password;
        try {
            const createdUser = await pb.collection('users').create(data);
            await login();
        } catch (err) {
            console.error("sign up", err);
        }
      }
    }
  
    function signOut() {
        console.log("sign out");
      pb.authStore.clear();
    }
  console.log({currentUser});
  </script>
  
  {#if $currentUser}
    <p>
      Signed in as {$currentUser.username} 
      <button on:click={signOut}>Sign Out</button>
    </p>
  {:else}
    <form on:submit|preventDefault>
      <input
        placeholder="Username"
        type="text"
        bind:value={username} 
        />
  
      <input 
        placeholder="Password" 
        type="password" 
        bind:value={password} 
      />

      <input 
        class="signup"
        placeholder="email" 
        type="text" 
        bind:value={email} 
      />

      <input 
        class="signup"
        placeholder="name" 
        type="text" 
        bind:value={name} 
      />

      <button on:click={signUp}>Sign Up</button>
      <button on:click={login}>Login</button>
    </form>
  {/if}


  <style>
    form{
        margin: auto;
        margin-top: 25vh;
        display: flex;
        flex-direction: column;
        max-width: 400px;
    }

    p {
        margin: auto;
        margin-top: 25vh;
        display: flex;
        flex-direction: column;
        /* max-width: 400px; */
        
    }

    .signup {
        display: none;
    }

    input, button {
        margin: 10px;
        /* line-height: 2em; */
        font-size: 1.5em;
    }

    button {
        width: fit-content;
        margin: 7px auto;
    }
</style>