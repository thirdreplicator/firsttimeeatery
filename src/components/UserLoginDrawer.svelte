<script>
  import { onMount } from "svelte";
  import { Drawer } from 'flowbite';
  import { currentUser, isLoggedIn } from "../stores/CurrentUserStore";
  import { fade, scale } from 'svelte/transition'

  let showLoginButton = 'none'
  let showWelcomeUser = 'none'
  let showLoginError = false
  let loginErrorMessage

  currentUser.subscribe(user => {
    if (isLoggedIn(user)) {
      showLoginButton = 'none'
      showWelcomeUser = 'block'
    } else {
      showLoginButton = 'block'
      showWelcomeUser = 'none'
    }
  })

  const logout = () => {
    $currentUser = {}
    window.location = '/'
  }

  const submitLoginForm = async  (e) => {
      e.preventDefault()
      const loginForm = document.getElementById('user-login-form')
      const formData = new FormData(loginForm)
      const formObj = Object.fromEntries(formData.entries())
      const formDataStringified = JSON.stringify(formObj)
      console.log(formDataStringified)


      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formDataStringified,
      });

      const data = await response.json()
      console.log('login response', data)
      if (data.loginInfo) {
        $currentUser = data.loginInfo
        window.location = '/menu'
      } else {
        console.log('1')
        showLoginError = true
        loginErrorMessage = data.message
      }
  }

  onMount(() => {
    const targetEl = document.getElementById('login-drawer')
    const loginButton = document.getElementById('login-button')
    const loginHideButton = document.getElementById('login-hide-button')
    
    const options = {
      placement: 'bottom',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30',
      onHide: () => {
          ;
      },
      onShow: () => {
        document.querySelectorAll('div[drawer-backdrop]')
          .forEach(el => el.addEventListener("click", (e) => {
            console.log('clicked on backdrop')
            var event = new KeyboardEvent('keydown', {'key': 'Escape'});
            document.dispatchEvent(event);
            document.querySelectorAll('div[drawer-backdrop]')
              .forEach(e => e.remove())}))
      },
      onToggle: () => {
          ;
      }
    };

    const drawer = new Drawer(targetEl, options);

    loginButton.addEventListener("click", () => {
      drawer.show()
    })
    loginHideButton.addEventListener("click", () => {
      drawer.hide()
    })

})

const hideMe = (e) => {
  showLoginError = false
}

</script>

<div class="text-center hidden" style="display: { showLoginButton }">
  <button
    id="login-button"
    class="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"  
    style="display: { showLoginButton }"
    type="button"
    data-drawer-target="login-drawer"
    data-drawer-placement="bottom"
    aria-controls="login-drawer"
    data-drawer-show="login-drawer"
  >
    Login
  </button>
</div>

<div id="welcome-user-message" 
     class="text-center hidden"
     style="display: { showWelcomeUser }">
    Welcome,
    { $currentUser.name  }!    
</div>

<div  class="text-center hidden"
      style="display: { showWelcomeUser }"> 
  <button id="logout-button"
      class=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"  
      type="button"
      on:click={ logout }
  >
    Logout
  </button>
</div>

<!-- drawer component -->
<div
  id="login-drawer"
  class="fixed bottom-0 left-0 right-0 z-50 w-full p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 translate-y-full"
  tabindex="-1"
  aria-labelledby="drawer-bottom-label"
>
  
<section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto container">


      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="/images/first_time_logo_s.webp" alt="logo">
          FirstTime    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
    
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div class="flex">
              <div>
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
            </div>
            <div class="text-end flex-1">
            <button
            id="login-hide-button"
            type="button"
            data-drawer-hide="login-drawer"
            aria-controls="login-drawer"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white float-right"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path></svg
            >
            <span class="sr-only">Close login drawer</span>
          </button>
        </div>

  </div>
              <form id="user-login-form" class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="">
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                  </div>
                  <!--
                  <div class="flex items-center justify-between">
                      <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                  </div>
                  -->
                  <div class="w-full text-center">
                    <button
                    type="submit"
                    class="w-40 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    on:click={ submitLoginForm }
                    >

                      Sign in
                    </button>
                  </div>

                  <!-- Error notification goes here. -->

                  {#if showLoginError }
                  <div id='user-login-error'
                    class="max-w-xs bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
                    role="alert"
                    in:fade out:scale
                    on:click={ hideMe }
                    >
                    <div id='user-login-error-hide-button' class="flex p-4">
                      <div class="flex-shrink-0">
                        <svg class="h-4 w-4 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-gray-700 dark:text-gray-400">
                          { loginErrorMessage }
                        </p>
                      </div>
                    </div>
                  </div>
                  {/if}


                  <div class="flex divider items-center justify-center">
                    <div class="flex-1 p-2"><hr /></div>
                    <div class="p-2 text-sm font-light text-gray-500 dark:text-gray-400">New customer?&nbsp;</div>
                    <div class="flex-1 p-2"><hr /></div>
                  </div>

                  <div class="text-sm font-light text-gray-500 dark:text-gray-400">
                    <a href="/signup">
                      <button
                        type="button"
                        class="mb-2 block w-full rounded border-2 border-primary px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                        data-te-ripple-init>
                        Create your FirstTime account
                      </button>
                    </a>
                  </div>

              </form>
          </div>
      </div>
  </div>


</section>

</div>

<style>
  .bg-google {
    background-color: #de5246;
  }

  .bg-facebook {
    background-color: #4267B2;
  }

</style>
