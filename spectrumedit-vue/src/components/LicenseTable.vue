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

		<v-dialog v-model="dialog" max-width="500px">
			<v-btn  slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
			<v-card>
				<v-card-title>
					<span class="headline">{{ formTitle }}</span>
				</v-card-title>
				<v-card-text>
					<v-container grid-list-md>
						<v-layout row wrap>
							<v-flex xs12 >
								<v-autocomplete :items="Operator_items" item-text="Operator_Country" v-model="editedItem.Operator_Country" label="Operator"></v-autocomplete>
							</v-flex>
							<v-flex xs12 >
								<v-autocomplete :items="Band_items" item-text="band" v-model="editedItem.band" label="Band"></v-autocomplete>
							</v-flex>
							<v-flex xs12>
								<v-text-field v-model="editedItem.licStartYear" label="License Start Year"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem.licEndYear" label="License End Year"></v-text-field>
							</v-flex>
						</v-layout>
						<v-btn  color="primary" :disabled="newfreqBTN" dark @click="dialog2 = true" class="mb-2">New Frequency entry</v-btn>
						<v-data-table :headers="freqheaders" v-bind:items="freqRows" hide-actions class="elevation-1">
							<template slot="items" slot-scope="props">
								<td class="text-xs-left">{{ props.item.freqStart }}</td>
								<td class="text-xs-left">{{ props.item.freqEnd }}</td>
								<td class="justify-center layout px-0">
									<v-btn icon class="mx-0" @click="editItemfreq(props.item)">
										<v-icon color="teal">edit</v-icon>
									</v-btn>
									<v-btn icon class="mx-0" @click="deleteItemfreq(props.item)">
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

							<v-flex xs12>
								<v-text-field v-model="editedItem2.freqStart" label="Start Frequency"></v-text-field>
							</v-flex>
							<v-flex xs12 >
								<v-text-field v-model="editedItem2.freqEnd" label="End Frequency"></v-text-field>
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

		<v-data-table :headers="headers" v-bind:items="tableRows" hide-actions :search="search" class="elevation-1" :v-model="selected">
			<template slot="items" slot-scope="props">
				<td>{{ props.item.Operator }}</td>
				<td class="text-xs-left">{{ props.item.CountryName }}</td>
				<td class="text-xs-left">{{ props.item.band }}</td>
				<td class="text-xs-left">{{ props.item.licStartYear }}</td>
				<td class="text-xs-left">{{ props.item.licEndYear }}</td>
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
			newfreqBTN: true,
			Band_items: [],
			Operator_items: [],
			Country_items: [],
			selected: [],

			rawHtml: '<h3>Spectrum License Table</h3>',
			dialog: false,
			dialog2: false,
			freqheaders: [
				{text: 'Freqency Start', value: 'freqStart'},
				{text: 'Freqency End', value: 'freqEnd'}
			],
			headers: [
				{
					text: 'Operator',
					align: 'left',
					value: 'Operator'
				},
				{ text: 'Country', value: 'CountryName' },
				{ text: 'Band', value: 'band' },
				{ text: 'Start Year', value: 'licStartYear' },
				{ text: 'End Year', value: 'licEndYear' }

			],
			tableRows: [],
			freqRows: [],
			editedIndex: -1,
			editedItem: {},
			editedIndex2: -1,
			editedItem2: {},

			defaultItem: {
				ID: 0,
				Operator: '',
				Operator_ID: 0,
				Operator_Country: '',
				band: 900,
				Band_ID: 1,
				licStartYear: '',
				licEndYear: '',
				CountryName: ''
			},

			defaultItem2: {
				ID: 0,
				license_ID: 0,
				freqStart: 0,
				freqEnd: 0
			},

		}),

			computed: {
				formTitle() {
					return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
				},

				formTitle2() {
					return this.editedIndex2 === -1 ? 'New Item' : 'Edit Item';
				}

			},

			watch: {
				dialog(val) {
					val || this.close()
				},
				dialog2(val) {
					val || this.close2()
				}
			},

			created () {
					this.initialise()
			},



			methods: {
				initialise () {
					// Set editedItem to Default
					this.editedItem = this.defaultItem;
					// Fill the License table from database
					this.getAllLicenses();
					// Fill the Band item table
					this.getAllBands();
					// Fill the Operator item table
					this.getAllOperators();


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
				getAllLicenses: function () {
					axios.get(this.PURL + "/api.php?action=read&table=licenses")
						.then(response => {
							if (response.data.error) {
								this.errorMessage = response.data.message;
							} else {
								this.tableRows = response.data;
							}
						});
				},

				// Function to read all Country data from sqlite database into Country_items  array
				getAllBands: function () {
					axios.get(this.PURL + "/api.php?action=read&table=freqbands")
							.then(response => {
								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.Band_items = response.data;

								}
							});

				},

				getAllOperators: function () {
					axios.get(this.PURL + "/api.php?action=read&table=operators")
							.then(response => {
								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.Operator_items = response.data;
									var arrayLength = this.Operator_items.length;
									for (var i = 0; i < arrayLength; i++) {
										this.Operator_items[i]['Operator_Country'] = this.Operator_items[i]['Operator'] + ' ' + this.Operator_items[i]['CountryName'];

									}
									//this.Operator_items = response.data.map(v=>v['Operator'] + ' ' + v['CountryName']);
									//this.Operator_items.sort;

								}
							});

				},



				getFrequencies(item) {
					var itemtext = "&license_ID=" + item.ID;
					axios.get(this.PURL + "/api.php?action=read&table=frequencies" + itemtext)
							.then(response => {
								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.freqRows = response.data;

								}
							});
				},

				editItem(item) {
					this.newfreqBTN = false;
					this.editedIndex = this.tableRows.indexOf(item);
					this.editedItem = Object.assign({}, item);
					this.editedItem['Operator_Country'] = this.editedItem['Operator'] + ' ' + this.editedItem['CountryName'];
					this.dialog = true;
					this.getFrequencies(item);
				},




				// Delete current highlighted item in table
				deleteItem(item) {
					var formData = this.toFormData(Object.assign({}, item));
					const index = this.tableRows.indexOf(item);

					if (confirm('Are you sure you want to delete this item?')) {

						// Function to Delete record in Owners table in sqlite database
						axios.post(this.PURL + "/api.php?action=delete&table=licenses", formData)
							.then(response => {
								console.log(response);

								if (response.data.error) {
									this.errorMessage = response.data.message;
								}
							});
						this.tableRows.splice(index,1);

					}

				},

				// Close the dialog box for new or updated item
				close() {
					this.dialog = false
					this.newfreqBTN=true;
					setTimeout(() => {
							this.editedItem = Object.assign({}, this.defaultItem);
							this.editedIndex = -1;
							this.freqRows = [];
					}, 300)
				},

				// Save either new item or updated item
				save: function () {

					// get Band_ID from returned Band
					this.editedItem.Band_ID = this.Band_items.find(x => x.band === this.editedItem.band).ID;

					// get Operator_ID from returned Operator
					this.editedItem.Operator_ID = this.Operator_items.find(x => x.Operator_Country === this.editedItem.Operator_Country).ID;
					this.editedItem.Operator = this.Operator_items.find(x => x.ID === this.editedItem.Operator_ID).Operator;
					this.editedItem.CountryName = this.Operator_items.find(x => x.ID === this.editedItem.Operator_ID).CountryName;

					var formData = this.toFormData(this.editedItem);
					console.log(this.editedItem);
					console.log(formData);

					this.response_axios = false;
					if (this.editedIndex > -1) {

						Object.assign(this.tableRows[this.editedIndex], this.editedItem);

						// Function to Update record in Licenses table in sqlite database
						axios.post(this.PURL + "/api.php?action=update&table=licenses", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
								}
							});
						this.getAllLicenses();
					} else {

						// Function to Add record in Licneses table in sqlite database
						axios.post(this.PURL + "/api.php?action=create&table=licenses", formData)
							.then(response => {

								if (response.data.error) {
									this.errorMessage = response.data.message;
								} else {
									this.response_axios = true;
									console.log(response.data)
									this.tableRows.push(this.editedItem);
								}
							});
						this.getAllLicenses();
					}
					this.close()
				},

				// Code for handling Frequency Assignments

				editItemfreq(item) {
					this.editedIndex2 = this.freqRows.indexOf(item);
					this.editedItem2 = Object.assign({}, item);
					this.dialog2 = true;
				},

				// Delete current highlighted item in table
				deleteItemfreq(item) {
					var formData = this.toFormData(Object.assign({}, item));
					const index = this.freqRows.indexOf(item);

					if (confirm('Are you sure you want to delete this item?')) {

						// Function to Delete record in Owners table in sqlite database
						axios.post(this.PURL + "/api.php?action=delete&table=frequencies", formData)
								.then(response => {
									console.log(response);

									if (response.data.error) {
										this.errorMessage = response.data.message;
									}
								});
						this.freqRows.splice(index,1);

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

					this.editedItem2.license_ID = this.editedItem.ID;
					var formData = this.toFormData(this.editedItem2);
					console.log(this.editedItem2);
					console.log(formData);

					this.response_axios = false;
					if (this.editedIndex2 > -1) {



						// Function to Update record in Frequencies table in sqlite database
						axios.post(this.PURL + "/api.php?action=update&table=frequencies", formData)
								.then(response => {

									if (response.data.error) {
										this.errorMessage = response.data.message;
									} else {
										Object.assign(this.freqRows[this.editedIndex2], this.editedItem2);
									}
								});

					} else {

						// Function to Add record in Frequencies table in sqlite database

						axios.post(this.PURL + "/api.php?action=create&table=frequencies", formData)
								.then(response => {

									if (response.data.error) {
										this.errorMessage = response.data.message;
									} else {
										this.freqRows.push(this.editedItem2);
									}
								});

					}
					this.close2()
				},

			}



	}
</script>
