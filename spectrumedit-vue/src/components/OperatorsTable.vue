<template>
	<div>
		<p><span v-html="rawHtml"></span></p>
		<v-dialog v-model="dialog" max-width="700px">
			<v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
			<v-card>
				<v-card-title>
					<span class="headline">{{ formTitle }}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout row wrap>
							<v-flex xs12>
								<v-text-field v-model="editedItem.Operator" label="Name"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-autocomplete :items="Country_items" item-text="CountryName" v-model="editedItem.CountryName" label="Country"></v-autocomplete>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.URL" label="URL"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.Wiki_URL" label="Wiki URL"></v-text-field>
							</v-flex>

						</v-layout>

						<v-btn  color="primary" :disabled="newShareBTN" dark @click="dialog2=true" class="mb-2">New Share</v-btn>
						<v-data-table :headers="shareHeaders" :items="shareRows" hide-actions class="elevation-1">
							<template slot="items" slot-scope="props">
								<td class="text-xs-left">{{ props.item.Name }}</td>
								<td class="text-xs-left">{{ props.item.SharePercent }}</td>
								<td class="text-xs-left">{{ props.item.Type }}</td>
								<td class="justify-center layout px-0">
									<v-btn icon class="mx-0" @click="editItemShare(props.item)">
										<v-icon color="teal">edit</v-icon>
									</v-btn>
									<v-btn icon class="mx-0" @click="deleteItemShare(props.item)">
										<v-icon color="pink">delete</v-icon>
									</v-btn>
								</td>
							</template>
						</v-data-table>


					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
					<v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialog2" max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">{{ formTitle2 }}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout row wrap>
							<v-flex xs12 >
								<v-autocomplete :items="Owner_items" item-text="Name" v-model="editedItem2.Name" label="Owner"></v-autocomplete>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem2.SharePercent" label="Share Percent"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem2.Type" label="Type"></v-text-field>
							</v-flex>
						</v-layout>

					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="close2">Cancel</v-btn>
					<v-btn color="blue darken-1" flat @click.native="save2">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>



		<v-data-table :headers="headers" :items="tableRows" hide-actions class="elevation-1">
			<template slot="items" slot-scope="props">
				<td class="text-xs-left">{{ props.item.Operator }}</td>
				<td class="text-xs-left">{{ props.item.CountryName }}</td>
				<td class="text-xs-left">{{ props.item.URL }}</td>
				<td class="text-xs-left">{{ props.item.Wiki_URL }}</td>
				<td class="justify-center layout px-0">
					<v-btn icon class="mx-0" @click="editItem(props.item)">
						<v-icon color="teal">edit</v-icon>
					</v-btn>
					<v-btn icon class="mx-0" @click="deleteItem(props.item)">
						<v-icon color="pink">delete</v-icon>
					</v-btn>
				</td>
			</template>
		</v-data-table>
	</div>
</template>

<script>

	import axios from 'axios';
	export default {
		data: () => ({
			errorMessage: '',
			Country_items: [],
			Owner_items: [],
			rawHtml: '<h1">Operators Table</h1>',
			dialog: false,

			dialog2: false,
			newShareBTN: true,

			headers: [
				{ text: 'Name', value: 'Operator'},
				{ text: 'Country', value: 'CountryName' },
				{ text: 'URL', value: 'URL' },
				{ text: 'Wiki URL', value: 'Wiki_URL' }

			],

			shareHeaders: [
				{ text: 'Owner', value: 'Name' },
				{ text: 'Share Percent', value: 'SharePercent' },
				{ text: 'Type', value: 'Type' }
			],

			tableRows: [],
			shareRows: [],

			editedIndex: -1,
			editedItem: {},
			editedIndex2: -1,
			editedItem2: {},

			defaultItem: {
				ID: 0,
				Operator: '',
				Country_ID: 206, // Default South Africa
				URL: '',
				Wiki_URL: '',
				CountryName: 'South Africa'
			},

			defaultItem2: {
				ID: 0,
				Investment_ID: 0,
				Owner_ID: 0,
				Name: '',
				SharePercent: 0,
				Type: ''
			},

			response_axios: false
		}),

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
			},
			formTitle2() {
				return this.editedIndex2 === -1 ? 'New Item' : 'Edit Item';
			}
		},

		watch: {
			dialog(val) {
				val || this.close()
			}
		},

		created () {
			this.initialise()
		},

		methods: {
			initialise () {
				// Set editedItem to Default
				this.editedItem = this.defaultItem;
				// Fill the Operators table from database
				this.getAllOperators();
				// Fill the Country item table
				this.getAllCountries();
				// Fill in the OWner item table
				this.getAllOwners();
			},

			// Function to convert object to Form data for a HTTP POST
			toFormData: function(obj){
				var form_data = new FormData();
				for ( var key in obj ) {
					form_data.append(key, obj[key]);
				}
				return form_data;
			},


			// Function to read all Operators from sqlite database into Operators array
			getAllOperators: function () {
				axios.get(this.PURL +  "/api.php?action=read&table=operators")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.tableRows = response.data;
							}
						});

			},

			getAllOwners: function () {
				axios.get(this.PURL +  "/api.php?action=read&table=owners")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.Owner_items = response.data;
							}
						});

			},


			// Function to read all Country data from sqlite database into Country_items  array
			getAllCountries: function () {
				axios.get(this.PURL + "/api.php?action=read&table=countries")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.Country_items = response.data;

							}
						});

			},



			// Function to retrieve ShareHolding for specific Owner
			getShares: function (item) {
				var itemtext = "&Operator_ID=" + item.ID;
				axios.get(this.PURL + "/api.php?action=read&table=shares" + itemtext)
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.shareRows = response.data;

							}
						});
			},


			// Set edited item to current highlighted item in table and show dialog box
			editItem(item) {
				this.editedIndex = this.tableRows.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialog = true;
				this.newShareBTN = false;
				this.getShares(item);
			},

			// Delete current highlighted item in table
			deleteItem(item) {
				var formData = this.toFormData(Object.assign({}, item));
				const index = this.tableRows.indexOf(item);
				this.response_axios = false;

				if (confirm('Are you sure you want to delete this item?')) {

					// Function to Delete record in Operators table in sqlite database
					axios.post(this.PURL + "/api.php?action=delete&table=operators", formData)
						.then(response => {
							console.log(response);

							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.response_axios = true;
							}
						});
					this.tableRows.splice(index,1);
					//if (this.response_axios)
					//	this.operators.splice(index,1);
				}

			},

			// Close the dialog box for new or updated item
			close() {
				this.dialog = false;
				setTimeout(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1
				}, 300)
				this.newShareBTN=true;
			},

			// Save either new item or updated item
			save: function () {

				// get Country_ID from returned CountryName
				this.editedItem.Country_ID = this.Country_items.find(x => x.CountryName === this.editedItem.CountryName).ID;

				var formData = this.toFormData(this.editedItem);
				console.log(this.editedItem);
				console.log(formData);

				this.response_axios = false;
				if (this.editedIndex > -1) {
					Object.assign(this.tableRows[this.editedIndex], this.editedItem)

					// Function to Update record in Operators table in sqlite database
					axios.post(this.PURL + "/api.php?action=update&table=operators", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
									//this.tableRows.push(this.editedItem)
								}
							});
					if (this.response_axios)
						this.getAllOperators();
				} else {

					// Function to Add record in Operators table in sqlite database
					axios.post(this.PURL + "/api.php?action=create&table=operators", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									this.tableRows.push(this.editedItem);
								}
							});
					if (this.response_axios)
						this.getAllOperators();
				}
				this.close()
			},


			editItemShare(item) {
				this.editedIndex2 = this.shareRows.indexOf(item);
				this.editedItem2 = Object.assign({}, item);
				this.dialog2 = true;
			},

			// Delete current highlighted item in table
			deleteItemShare(item) {
				var formData = this.toFormData(Object.assign({}, item));
				const index = this.shareRows.indexOf(item);

				if (confirm('Are you sure you want to delete this item?')) {

					// Function to Delete record in Owners table in sqlite database
					axios.post(this.PURL + "/api.php?action=delete&table=shares", formData)
							.then(response => {
								console.log(response);

								if (response.data.error) {
									this.errorMessage = response.data.message;
								}
							});
					this.shareRows.splice(index,1);

				}

			},

			// Close the dialog box for new or updated item
			close2() {
				this.dialog2 = false
				setTimeout(() => {
					this.editedItem2 = Object.assign({}, this.defaultItem2)
					this.editedIndex2 = -1
				}, 300)
			},

			// Save either new item or updated item
			save2: function () {

				this.editedItem2.Investment_ID = this.editedItem.ID;
				this.editedItem2.Owner_ID = this.Owner_items.find(x => x.Name === this.editedItem2.Name).ID;


				var formData = this.toFormData(this.editedItem2);
				console.log(this.editedItem2);
				console.log(formData);

				this.response_axios = false;
				if (this.editedIndex2 > -1) {

					Object.assign(this.shareRows[this.editedIndex2], this.editedItem2);

					// Function to Update record in Owners table in sqlite database
					axios.post(this.PURL + "/api.php?action=update&table=shares", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
								}
							});

				} else {

					// Function to Add record in Operators table in sqlite database
					axios.post(this.PURL + "/api.php?action=create&table=shares", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
									this.shareRows.push(this.editedItem2);
								}
							});

				}
				this.close2()
			},



		}

	}
</script>