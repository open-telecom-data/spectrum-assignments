<template>
	<div>
		<v-app>
			<v-navigation-drawer fixed :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" app>
				<v-list>
					<v-list-tile :value="true" v-for="item in items" :key="item.title" :to="{path: item.route}">
						<v-list-tile-action>
							<v-icon light v-html="item.icon"></v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="item.title"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>
			<v-toolbar fixed app :clipped-left="clipped">
				<v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
				<v-btn icon @click.stop="miniVariant = !miniVariant">
					<v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
				</v-btn>
				<v-btn icon @click.stop="clipped = !clipped">
					<v-icon>web</v-icon>
				</v-btn>

				<v-toolbar-title v-text="title"></v-toolbar-title>
				<v-spacer></v-spacer>

			</v-toolbar>
			<main>
				<v-content>
					<v-container fluid>
						<v-fade-transition mode="out-in">
							<router-view></router-view>
						</v-fade-transition>
					</v-container>
				</v-content>
			</main>
			<v-footer :fixed="fixed" app>
				<span>&copy; 2017</span>
			</v-footer>
		</v-app>
	</div>
</template>

<script>

	export default {
		data: () => ({
			items: [
				{ icon: 'bubble_chart', title: 'Owners', route: '/' },
				{ icon: 'bubble_chart', title: 'Operators', route: '/operators' },
				{ icon: 'bubble_chart', title: 'Spectrum Licenses', route: '/licenses' },
				//{ icon: 'bubble_chart', title: 'Frequency Assignments', route: '/frequency' },
				{ icon: 'bubble_chart', title: 'Frequency Bands', route: '/bands' }
			],
			clipped: true,
			drawer: true,
			fixed: false,
			miniVariant: false,
			right: false,
			rightDrawer: false,
			title: 'Spectrum Assignment Editor',
			dialog: false,
			listPrimitive: null
		}),

		/*components: {
			appDataTable: DataTable
		},*/

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
			}
		},

		watch: {
			dialog(val) {
				val || this.close()
			}
		}
	}
</script>
