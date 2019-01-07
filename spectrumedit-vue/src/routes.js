import operators from './components/OperatorsTable.vue';
import owners from './components/OwnersTable.vue';
import bands from './components/BandsTable.vue';
import licenses from './components/LicenseTable.vue';

export const routes = [
	{ path: '', component: owners},
	{ path: '/operators', component: operators},
	{ path: '/bands', component: bands},
	{ path: '/licenses', component: licenses}
];
