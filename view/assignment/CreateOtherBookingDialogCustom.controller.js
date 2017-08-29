/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.RoleBusinessRules");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
// jQuery.sap.require("mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingDialogCustom", {
	onInit: function() {
		this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle()
	},
	onCancelDialog: function() {
		if (!this.oPopup) {
			this.oPopup = this.getView().getParent();
		}
		this.oPopup.close();
		this.getView().destroy();
	},
deleteOtherAssignment: function(e){
	var o = this.byId("otherBooking");
	var c = this.byId("otherBooking").getController();
// var t =	c.deleteAssignment();
	sap.ui.getCore().getEventBus().subscribe(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util.Constants
			.Events.ASSIGNMENT_SAVED, this.onCancelDialog, this);
				c.deleteAssignment();
// if(t === "true"){
// 	this.getView().getId("btn1").setEnabled(true);
// }else{
// 	this.getView().getId("btn1").setEnabled(false);
// }

	// this.delete = mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom.deleteAssignment(o);
	},
	createOtherAssignment: function() {
		sap.ui.getCore().getEventBus().subscribe(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util.Constants
			.Events.ASSIGNMENT_SAVED, this.onCancelDialog, this);
		var c = this.byId("otherBooking").getController();
		c.createAssignment()
	},
	setConsultantData: function(d) {
		this.AssignmentModel = new sap.ui.model.json.JSONModel();
		this.AssignmentModel.setData(mrs.resourcemanagement.Util.DataPreparation.createNewAssignment(d));
		this.CandidateModel = new sap.ui.model.json.JSONModel();
		this.CandidateModel.setData({
			PersonSet: d
		});
		this.byId("otherBooking").setModel(this.AssignmentModel, "AssignmentModel");
		this.byId("otherBooking").setModel(this.CandidateModel, "CandidateModel")
	},
	setStartDate: function(d) {
		if (this.AssignmentModel) {
			this.AssignmentModel.getData().StartDate = d;
			this.AssignmentModel.getData().EndDate = d
		}
	}
});