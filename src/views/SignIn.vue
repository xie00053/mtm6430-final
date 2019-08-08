<template>
    <div>
        
        <form @submit.prevent="onSubmit">
            <h1 class="card-header">Sign In</h1>
            <div class="row">
                <div class="col-6">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" id="email" requried />
                </div>
                <div class="col-6">
                    <label for="pass">Password</label>
                    <input type="password" v-model="pass" id="pass" requried />
                </div>
            </div>
            <button type="submit" class="btn btn-warning">Submit</button>
        </form>
    </div>
</template>
<script>
import { mapActions } from "vuex";
    export default {
        data() {
            return {
                email: "",
                pass: ""
            };
        },

        methods: {
            ...mapActions(["signIn"]),
            onSubmit() {
            const formData = {
                email: this.email,
                password: this.pass
            };

            this.signIn(formData);
            }
        }
    };
</script>

<style>
.card-header {
    margin-bottom: 2rem;
}
h1 {
    text-align: center;
}
form {
    color: white;
    padding: 2rem;
    background: #17a2b8 !important;
    box-shadow: -2px 2px 6px;
    max-width: 30rem;
    margin: 0 auto;
}

label {
    display: block;
}

input,
button {
    padding: 5px 10px;
    margin: 10px 0;
}

</style>