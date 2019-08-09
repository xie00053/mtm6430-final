<template>
    <div>
        <!-- Sign Up Form -->
        <form @submit.prevent="onSubmit">
            <h1 class="card-header">Sign Up</h1>

            <div class="row">
                <div class="col-6">
                    <label for="name">Name</label>
                    <input type="text" v-model="name" id="name" requried />
                </div>
                <div class="col-6">
                    <label for="age">Age</label>
                    <input type="text" v-model="age" id="age" requried />
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="city">City</label>
                    <input type="text" v-model="city" id="city" requried />
                </div>
                <div class="col-6">
                    <label for="job">Job</label>
                    <input type="text" v-model="job" id="job" requried />
                </div>
            </div>
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
                name: "",
                age:"",
                city:"",
                job:"",
                email: "",
                pass: ""
            };
        },

        methods: {
            ...mapActions(["signUp"]),
            onSubmit() {
            const formData = {
                name: this.name,
                age: this.age,
                city: this.city,
                job: this.job,
                email: this.email,
                password: this.pass,
            };
            this.signUp(formData);
        }
        }
    };

</script>

<style scoped>
form {
    color: white;
    padding: 2rem;
    background: #17a2b8 !important;
    box-shadow: -1px 1px 10px;
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