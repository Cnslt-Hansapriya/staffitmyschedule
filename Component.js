jQuery.sap.declare("mrs.resourcemanagement.ZMRS_SCHEDULE.Component");
// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "mrs.resourcemanagement",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/MRSS/RM" // we use a URL relative to our own component
		// extension application is deployed with customer namespace
});
this.mrs.resourcemanagement.Component.extend("mrs.resourcemanagement.ZMRS_SCHEDULE.Component", {
	metadata: {
		version: "1.0",
		config: {},
		// viewPath: "mrs.resourcemanagement.view",
		// fullScreenPageRoutes: {
		// 		"myschedule": {
		// 		"pattern": "myschedule/{id}",
		// 		"view": "myschedule.MyScheduleOverview"
		// 	}
		// },
		// rootview: "MyScheduleOverviewCustom",
		customizing: {
			"sap.ui.viewReplacements": {
				"mrs.resourcemanagement.view.myschedule.MyScheduleOverview": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleOverviewCustom",
					"type": "XML"
				},
					"mrs.resourcemanagement.view.myschedule.MySchedule": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.myschedule.SelfBookingExistingProject": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.SelfBookingExistingProjectCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.assignment.CreateConcreteAssignment": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateConcreteAssignmentCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.assignment.CreateOtherBooking": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.assignment.CreateOtherBookingDialog": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingDialogCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.assignment.CandidateAssignmentEditDialog": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CandidateAssignmentEditDialogCustom",
					"type": "XML"
				},
				"mrs.resourcemanagement.view.assignment.CandidateDisplayEditPopover": {
					"viewName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CandidateDisplayEditPopoverCustom",
					"type": "XML"
				}
			},
			"sap.ui.controllerExtensions": {
				"mrs.resourcemanagement.view.myschedule.SelfBookingExistingProject": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.SelfBookingExistingProjectCustom"
				},
				"mrs.resourcemanagement.view.myschedule.MyScheduleOverview": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleOverviewCustom"
				},
				"mrs.resourcemanagement.view.myschedule.MySchedule": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleCustom"
				},
				"mrs.resourcemanagement.view.assignment.CandidateAssignmentEditDialog": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CandidateAssignmentEditDialogCustom"
				},
				"mrs.resourcemanagement.view.assignment.CreateConcreteAssignment": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateConcreteAssignmentCustom"
				},
				"mrs.resourcemanagement.view.assignment.CreateOtherBooking": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom"
				},
				"mrs.resourcemanagement.view.assignment.CreateOtherBookingDialog": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingDialogCustom"
				},
				"mrs.resourcemanagement.view.assignment.TeamAssignmentEditDialog": {
					"controllerName": "mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.TeamAssignmentEditDialogCustom"
				}
			}
		}
	}
});