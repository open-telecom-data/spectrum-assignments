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
								<v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.URL" label="URL"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.Wiki_URL" label="Wiki URL"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-autocomplete :items="Country_items" item-text="CountryName" v-model="editedItem.CountryName" label="Country"></v-autocomplete>
							</v-flex>
						</v-layout>





					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
					<v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-data-table :headers="headers" :items="tableRows" hide-actions class="elevation-1">
			<template slot="items" slot-scope="props">
				<td>{{ props.item.Name }}</td>
				<td class="text-xs-left">{{ props.item.URL }}</td>
				<td class="text-xs-left">{{ props.item.Wiki_URL }}</td>
				<td class="text-xs-left">{{ props.item.CountryName }}</td>
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
			rawHtml: '<h1">Owners Table</h1>',
			title: 'Spectrum Assignment Editor',
			dialog: false,

			headers: [
				{
					text: 'Name',
					align: 'left',
					value: 'Name'
				},
				{ text: 'URL', value: 'URL' },
				{ text: 'Wiki URL', value: 'Wiki_URL' },
				{ text: 'Country', value: 'CountryName' },
			],

			tableRows: [],

			editedIndex: -1,
			editedItem: {},

			defaultItem: {
				ID: 0,
				Name: '',
				URL: '',
				Wiki_URL: '',
				Country_ID: 206, // Default South Africa
				CountryName: 'South Africa'
			},



		}),

			computed: {
					formTitle() {
							return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
					this.getAllOwners();
					// Fill the Country item table
					this.getAllCountries();
				},


				// Function to convert object to Form data for a HTTP POST
				toFormData: function(obj){
					var form_data = new FormData();
					for ( var key in obj ) {
						form_data.append(key, obj[key]);
					}
					return form_data;
				},

				// Function to read all Owners from sqlite database into owners array
				getAllOwners: function () {
					axios.get(this.PURL + "/api.php?action=read&table=owners")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.tableRows = response.data;
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



				editItem(item) {
					this.editedIndex = this.tableRows.indexOf(item)
					this.editedItem = Object.assign({}, item)
					this.dialog = true

				},



				// Delete current highlighted item in table
				deleteItem(item) {
					var formData = this.toFormData(Object.assign({}, item));
					const index = this.tableRows.indexOf(item);
					this.response_axios = false;

					if (confirm('Are you sure you want to delete this item?')) {

						// Function to Delete record in Owners table in sqlite database
						axios.post(this.PURL + "/api.php?action=delete&table=owners", formData)
							.then(response => {
								console.log(response);

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
								}
							});
						this.tableRows.splice(index,1);

					}

				},

				// Close the dialog box for new or updated item
				close() {
					this.dialog = false
					setTimeout(() => {
							this.editedItem = Object.assign({}, this.defaultItem)
							this.editedIndex = -1
					}, 300)
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

						// Function to Update record in Owners table in sqlite database
						axios.post(this.PURL + "/api.php?action=update&table=owners", formData)
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
							this.getAllOwners();
					} else {

						// Function to Add record in Operators table in sqlite database
						axios.post(this.PURL + "/api.php?action=create&table=owners", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
									this.tableRows.push(this.editedItem);
								}
							});
						if (this.response_axios)
							this.getAllOwners();
					}
					this.close()
				}
			}


	}
</script>
