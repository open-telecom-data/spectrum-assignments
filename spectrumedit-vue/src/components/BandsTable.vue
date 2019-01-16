<template>
	<div>
		<p><span v-html="rawHtml"></span></p>

		<v-flex xs12 sm6>
			<v-text-field
					v-model="search"
					append-icon="search"
					label="Search"
					box
			></v-text-field>
		</v-flex>

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
								<v-text-field v-model="editedItem.band" label="Band [MHz]"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.bandStart" label="Band Start Frequency [MHz]"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.bandEnd" label="Band End Frequency [MHz]"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.guardStart" label="Guard band Start Frequency [MHz]"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.guardEnd" label="Guard band End Frequency [MHz]"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-autocomplete :items="typeOptions" v-model="editedItem.Type" label="Duplexing Type"></v-autocomplete>
							</v-flex>
							<v-flex xs12 >
								<v-autocomplete :items="downlinkOptions"  v-model="editedItem.Downlink" label="Section of band used for Downlink"></v-autocomplete>
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
		<v-data-table :headers="headers" :items="tableRows" hide-actions :search="search" class="elevation-1">
			<template slot="items" slot-scope="props">
				<td>{{ props.item.band }}</td>
				<td class="text-xs-left">{{ props.item.bandStart}}</td>
				<td class="text-xs-left">{{ props.item.bandEnd}}</td>
				<td class="text-xs-left">{{ props.item.guardStart}}</td>
				<td class="text-xs-left">{{ props.item.guardEnd}}</td>
				<td class="text-xs-left">{{ props.item.Type}}</td>
				<td class="text-xs-left">{{ props.item.Downlink}}</td>
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
			search: '',
			errorMessage: '',
			rawHtml: '<h1">Frequency Bands Table</h1>',

			typeOptions: ['FDD','TDD'],
			downlinkOptions: ['Lower','Upper'],

			dialog: false,
			headers: [
				{
					text: 'Band',
					align: 'left',
					value: 'band'
				},
				{ text: 'Band Start', value: 'bandStart' },
				{ text: 'Band End', value: 'bandEnd' },
				{ text: 'Guard Start', value: 'guardStart' },
				{ text: 'Guard End', value: 'guardEnd' },
				{ text: 'Type', value: 'Type' },
				{ text: 'Downlink', value: 'Downlink' }
			],
			tableRows: [],

			editedIndex: -1,
			editedItem: {},

			defaultItem: {
				ID: 0,
				band: '',
				bandStart: '',
				bandEnd: '',
				guardStart: '',
				guardEnd: '',
				Type: 'FDD',
				Downlink: 'L'
			},

			response_axios: false
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
				// Set Edited Item to Default
				this.editedItem = this.defaultItem;
				// Fill th Operators table from database
				this.getAllItems();
			},

			// Function to convert object to Form data for a HTTP POST
			toFormData: function(obj){
				var form_data = new FormData();
				for ( var key in obj ) {
					form_data.append(key, obj[key]);
				}
				return form_data;
			},


			// Function to read all items from sqlite database into tableRows array
			getAllItems: function () {
				axios.get(this.PURL + "/api.php?action=read&table=freqbands")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.tableRows = response.data;
								//console.log(this.tableRows);
							}
						});
			},

			// Set edited item to current highlighted item in table and show dialog box
			editItem(item) {
				this.editedIndex = this.tableRows.indexOf(item);
				this.editedItem = Object.assign({}, item);
				if (this.editedItem.Downlink === 'L')
					this.editedItem.Downlink = 'Lower';
				else
					this.editedItem.Downlink = 'Upper';
				this.dialog = true
			},

			// Delete current highlighted item in table
			deleteItem(item) {
				var formData = this.toFormData(Object.assign({}, item));
				const index = this.tableRows.indexOf(item);
				this.response_axios = false;

				if (confirm('Are you sure you want to delete this item?')) {

					// Function to Delete record in Operators table in sqlite database
					axios.post(this.PURL + "/api.php?action=delete&table=freqbands", formData)
						.then(response => {
							//console.log(response);

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
				this.dialog = false
				setTimeout(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1
				}, 300)
			},

			// Save either new item or updated item
			save: function () {

				// Store the symbol key value pair returned from edit process as the Downlink field
				if (this.editedItem.Downlink === 'Lower')
					this.editedItem.Downlink = 'L';
				else
					this.editedItem.Downlink = 'U';

				var formData = this.toFormData(this.editedItem);
				//console.log(this.editedItem);
				//console.log(formData);

				this.response_axios = false;
				if (this.editedIndex > -1) {
					Object.assign(this.tableRows[this.editedIndex], this.editedItem)

					// Function to Update record in freqBands table in sqlite database
					axios.post(this.PURL +  "/api.php?action=update&table=freqbands", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									//console.log(response.data)
									//this.operators.push(this.editedItem)
								}
							});
					// If we succeeded in saving the value to the database re-read values back to tableRows
					if (this.response_axios)
						this.getAllItems();
				} else {

					// Function to Add record in freqBands table in sqlite database
					axios.post(this.PURL + "/api.php?action=create&table=freqbands", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
									//console.log(response.data.message)
								} else {
									this.response_axios = true;
									this.tableRows.push(this.editedItem);
									//console.log(response.data)
								}
							});
					if (this.response_axios)
						this.getAllItems();
				}
				this.close()
			}
		}


	}
</script>
