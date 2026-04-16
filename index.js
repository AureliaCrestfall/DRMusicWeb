const baseUrl = "http://localhost:5137/API/Music"

Vue.createApp({
    data() {
        return {
            records: [],
            allrecords:[],
            singleRecord: null,
            deleteId: null,
            deleteMessage: "",
            addData: { title: "", artist: "", duration: null, publicationYear: "" },
            addMessage: "",
            updateData: { id: null, title: "", artist: "", duration: null, publicationYear: "" },
            updateMessage: "",
            artist: null
        }
    },
    methods: {
        getAllRecords() {
            this.getRecords(baseUrl)
    },

    async getRecords(url) {
    try {
        const response = await axios.get(url)
        this.allrecords = await response.data

    } catch (ex) {
        alert(ex.message)
    }
    },
     async getById(id) {
            if (id === null || id === undefined || isNaN(id) || id <= 0) {
                alert("Please enter a valid record ID")
                return
            }
            const url = baseUrl + "/" + id
            try {
                const response = await axios.get(url)
                this.singleRecord = await response.data
            } catch (ex) {
                this.singleRecord = null
                alert(ex.message)
            }
        },
        filterByTitle(artist) {
            console.log("Title:" + artist + ":")
            console.log("All books " + this.allrecords)
            this.records = this.allrecords.filter(b => b.artist.includes(artist))
            console.log("filtered Books: " + this.records)
        }
    
     
     
}
}).mount("#app")