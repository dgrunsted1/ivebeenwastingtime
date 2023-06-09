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
  }

  async function signUp() {
      //todo show additional elkement shen signing up
      if (!name && !email){
          let elements = document.getElementsByClassName('signup');
          elements.forEach((curr) => {
              curr.style.display = 'block';
          });
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
  form {
      margin-top: 25px;
      display: flex;
  }

  .signup {
      display: none;
  }
</style>