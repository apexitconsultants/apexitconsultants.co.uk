Vue.use(VueRecaptcha);

var contactApp = new Vue({
    el: '#contact-app',
    components: {
        'vue-recaptcha': VueRecaptcha,
    },
    data: {
        reCaptchakey: '6Ldk4Y0UAAAAAF4lAiWod1aMJWRrkE1T9f5SteHj',
        formData: {
            name: null,
            email: null,
            message: null,
            g_recaptcha_response: null,
            processing: false,
            errors: {
                name: [],
                email: [],
                message: [],
                g_recaptcha_response: [],
            }
        }
    },
    methods: {
        resetForm() {
            this.formData = {
                name: null,
                email: null,
                message: null,
                g_recaptcha_response: null,
                processing: false,
                errors: {
                    name: [],
                    email: [],
                    message: [],
                    g_recaptcha_response: [],
                }
            };
        },
        submitForm() {
            var vm = this;
            vm.formData.processing = true;
            axios.post('https://api.adakka.com/v1/apexitconsultants',
                    vm.formData, 
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                        }
                    })
                .then(function(response) {
                    vm.formData.processing = false;
                    vm.resetForm();
                    Swal.fire({
                        type: 'success',
                        title: 'Done...',
                        text: response.data.message
                    });
                }).catch(function(error) {
                    vm.formData.processing = false;
                    vm.$refs.contactRecaptcha.reset();
                    var errorMessage = "Sorry, there was an error!";
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: errorMessage
                    });

                    if (error.response.data.errors) {
                        vm.formData.errors = error.response.data.errors;
                    }
                });
        },
        onVerify: function(response) {
            this.formData.g_recaptcha_response = response;
        },
    }
});