<script lang="ts">
  import { fade, scale } from 'svelte/transition'
  import { currentUser } from '../stores/CurrentUserStore'
  import { scrollTo } from '../lib/utils'

  

  let responseMessage: string
  let alertLevel = ""
  let isRemember = false

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    hideWarningMessage()
    if (validateName()) { return }
    if (validatePasswordLength()) { return }
    if (validateEntropy()) { return }
    if (validatePasswordsMatch()) { return }

    const theForm = document.getElementById('user-registration-form')
    const formData = new FormData(theForm)
    const formObj = Object.fromEntries(formData.entries())
    delete formObj.password_confirmation
    const formDataStringified = JSON.stringify(formObj)

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: formDataStringified,
    });

    const data = await response.json()

    if (/registered/.test(data.message)) {
      displaySuccessMessage(data)
      clearForm()
    } else if (/duplicate key value violates unique constraint "User_email_idx"/.test(data.message)) {
       displayWarningMessage("A customer account with that email already exists.")
    } else {
      displayWarningMessage(data.message)
    }
  }

  const displaySuccessMessage = ({userId, name, token, refreshToken}) => {
    $currentUser = { userId, name, token, refreshToken }
    alertLevel = "success"
    responseMessage = `Successfully registered!`
    scrollTo('user-registration-success')
  }

  const displayWarningMessage = (message) => {
    alertLevel = "warn"
    responseMessage = message
    scrollTo('user-registration-error')
  }

  const validate = (selector, condition, warning) => {
    const el = document.querySelector(selector)
    const val = el.value
    if (!condition(val)) {
      displayWarningMessage(warning)
      return true
    }
  }

  const validatePasswordLength = () => validate('#user-registration-form input[name="password"]',
    value => value.length >= 8,
    'The `password` field should be at least 8 characters.')

  const validateName = () => validate('#user-registration-form input[name="name"]',
    value => value.length > 0,
    'The `name` field cannot be empty.')
    
  const validateEntropy = () => validate('#user-registration-form input[name="password"]',
    value => (value.match(/[A-Za-z]/) && value.match(/[0-9]/)) ,
    'The password should contain at least one alphabet character and one number.')

  const hideWarningMessage = (e) => {
    alertLevel = ""
  }

  const validatePasswordsMatch = () => {
    const passwordConfirmationValue = document.querySelector('#user-registration-form input[name="password_confirmation"]').value
    return validate('#user-registration-form input[name="password"]',
      value => value == passwordConfirmationValue,
      "The password confirmation doesn't match the password.")
  }
  const toggleRememberMe = (e) => {
    if (isRemember) {
      isRemember = false
    } else {
      isRemember = true
    }
  }

  const clearForm = () => {
    const elName = document.querySelector('#user-registration-form input[name="name"]')
    elName.value = ''

    const elEmail = document.querySelector('#user-registration-form input[type="email"]')
    elEmail.value = ''

    const elPassword = document.querySelector('#user-registration-form input[name="password"]')
    elPassword.value = ''

    const elConfirmation = document.querySelector('#user-registration-form input[name="password_confirmation"]')
    elConfirmation.value = ''
  }

</script>
<!--
<button class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
  on:click={ clearForm }>
  Click me!
</button>
-->
<form id="user-registration-form" class="space-y-4 md:space-y-6 mt-4" on:submit="{submit}">
  <!-- name -->
  <div>
    <label
      for="name"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Your name</label
    >
    <input
      type="name"
      name="name"
      value=""
      id="user_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Johnny Appleseed"
      required=""
    />
  </div>

  <!-- Email -->
  <div>
    <label
      for="email"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Your email</label
    >
    <input
      type="email"
      name="email"
      value=""
      id="user_email"
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="name@company.com"
      required=""
    />
  </div>

  <!-- Password -->
  <div>
    <label
      for="password"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Password</label
    >
    <input
      type="password"
      name="password"
      id="user_password"
      value=""
      placeholder="••••••••"
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required=""
    />
  </div>
  <!-- Confirm password -->
  <div>
    <label
      for="password_confirmation"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >Re-enter password</label
    >
    <input
      type="password"
      name="password_confirmation"
      value=""
      id="password_confirmation"
      placeholder=""
      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required=""
    />
  </div>

  <!-- Remember me 
  <div class="flex items-center justify-between">
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="user_remember"
          aria-describedby="remember"
          type="checkbox"
          class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
          required=""
          bind:checked="{ isRemember }"
        />
      </div>
      <div class="ml-3 text-sm">
        <label
          for="remember"
          class="text-gray-500 dark:text-gray-300"
          on:click={ toggleRememberMe }
        >
          Remember me
        </label>
      </div>
    </div>
    <a
      href="#"
      class="text-sm font-medium text-gray-500 hover:underline dark:text-gray-300"
      >Forgot password?</a
    >
  </div>
-->

  <!-- Submit button -->
  <div class="w-full text-center">
    <button
      id="user_registration_submit"
      type="submit"
      class="w-40 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Let's Go!
    </button>
  </div>
</form>

  <!-- Response message-->
  {#if alertLevel == "warn" }
  <div id='user-registration-error'
  class="user_reg_error mt-8 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 {alertLevel.length > 0 ? "" : "hidden"}"
  role="alert"
  in:fade out:scale
  >
    <div class="flex">
      <div>
        <p class="font-bold">Oh no!</p>
      </div>
      
      <div class="text-end flex-1">
        <button
        type="button"
        aria-controls="close user registration form warning message"
        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white float-right"
        on:click={ hideWarningMessage }
      >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            >
              <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd">
              </path>
            </svg>
          <span class="sr-only">Close user registration form error message</span>
        </button>
      </div>
    </div>
    <p>{ responseMessage }</p>
  </div>
  {:else if alertLevel == "success"}
  <div id="user-registration-success"
      class="mt-8 bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
      role="alert"
      in:fade out:scale
      >
    <div class="flex">
      <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
      <div>
        <p class="font-bold">Yes!</p>
        <p class="text-sm">{ responseMessage }</p>
      </div>
    </div>
  </div>
  {/if}
