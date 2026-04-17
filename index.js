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

        async getAllRecords() {
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
        },
        async deleteRecord() {
            try {
                await axios.delete(`${baseUrl}/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.jwtToken
                    }
                });

                this.records = this.records.filter(r => r.id !== this.deleteId);
                this.deleteId = null;
                this.message = "Record deleted successfully";

            } catch (ex) {
                this.message = "Failed to delete record - " + ex.message;
            }
        },
        async updateDataRecord() {
            try {
                const response = await axios.put(
                    `${baseUrl}/${this.updateData.id}`,
                    this.updateData,
                    {
                        headers: { Authorization: 'Bearer ' + this.jwtToken }
                    }
                );

                const index = this.records.findIndex(r => r.id === this.updateData.id);
                if (index !== -1) {
                    this.records[index] = response.data;
                }

                this.updateData = {
                    id: null, title: "", artist: "", duration: null, publicationYear: ""
                };

                this.message = "Record updated successfully";

            } catch (ex) {
                this.message = "Failed to update record - " + ex.message;
            }
        }

    }
}).mount("#app")