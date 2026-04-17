authUrl = "http://localhost:5137/API/Auth/Login/";

const baseUrl = "http://localhost:5137/API/Music"


Vue.createApp({
    data() {
        return {
            records: [],
            allrecords: [],
            singleRecord: null,
            deleteId: null,
            deleteMessage: "",
            addData: { title: "", artist: "", duration: null, publicationYear: "" },
            addMessage: "",
            updateData: { id: null, title: "", artist: "", duration: null, publicationYear: "" },
            updateMessage: "",
            artist: null,
            auth: { username: "", password: "" },
            loggedIn: false,
            authMessage: null,
            jwtToken: null,
            role: null
        }
    },
    methods: {
       async login() {
            axios.post(authUrl, this.auth)
                .then(response => {
                    this.jwtToken = response.data.token;
                    this.role = response.data.role;
                    this.loggedIn = true;
                    this.authMessage = "Authentication successful";
                    this.getRecords(baseUrl); // Fetch records immediately after successful login
                }).catch(ex => {
                    this.authMessage = "Authentication failed - " + ex.message;
                });
        },
        logout() {
            this.jwtToken = null;
            this.role = null;
            this.loggedIn = false;
            this.auth = { username: "", password: "" };
            this.records = [];
            this.message = null;
            this.authMessage = "Logged out successfully";
        },

       async  getAllRecords() {
            this.getRecords(baseUrl)
        },

        async getRecords(url) {
            try {
                const response = await axios.get(url)
                this.records = await response.data

            } catch (ex) {
                alert(ex.message)
            }
        },
        async filterByTitle(title) {
            await this.getRecords(baseUrl)
            console.log("Title:" + title + ":")
            console.log("All records " + this.records)
            this.allrecords = this.records.filter(b => b.title.includes(title))
            console.log("filtered records: " + this.records)
        },
         addRecord() {
            axios.post(baseUrl, this.addData, {
                headers: { // TODO - move to interceptor
                    'Authorization': 'Bearer ' + this.jwtToken
                }
            })
                .then(response => {
                    this.records.push(response.data);
                    this.message = "record added successfully";
                    this.addData = { title: "", artist: "", duration: null, publicationYear: "" }; // Reset the form
                })
                .catch(ex => {
                    this.message = "Failed to add record - " + ex.message;
                });
        }, deleteRecord() {
            axios.delete(baseUrl, this.deleteId, {
                headers: { // TODO - move to interceptor
                    'Authorization': 'Bearer ' + this.jwtToken
                }
            })
                .then(response => {
                    this.records.push(response.data);
                    this.message = "record added successfully";
                    this.deleteId = null; // Reset the form
                })
                .catch(ex => {
                    this.message = "Failed to add record - " + ex.message;
                });
        }, updateDataRecord() {
            axios.put(baseUrl, this.updateData, {
                headers: { // TODO - move to interceptor
                    'Authorization': 'Bearer ' + this.jwtToken
                }
            })
                .then(response => {
                    this.records.push(response.data);
                    this.message = "record added successfully";
                    this.updateData = { id: null, title: "", artist: "", duration: null, publicationYear: "" }; // Reset the form
                })
                .catch(ex => {
                    this.message = "Failed to add record - " + ex.message;
                });
        }

    }
}).mount("#app")