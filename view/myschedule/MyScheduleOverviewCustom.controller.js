jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleOverviewCustom", {
	that1:null,

	    getURLParameter: function(name){
return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}, 
	      getMyComponent: function() {
     "use strict";
     var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
     return sap.ui.component(sComponentId);
   },
   onCreate : function() {
  
     var oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
   },
	    createAddActionSheet: function () {
	        if (!this._oAddActionSheet) {
	            var w = Math.max(this.getView().getModel("i18n").getResourceBundle().getText("FROM_EXISTING_PROJECT_REQUEST").length) * 8;
	            w = Math.max(w, 150);
	            this._oAddActionSheet = sap.ui.xmlfragment("mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.AddNewSelfBooking", this);
	            this.getView().addDependent(this._oAddActionSheet);
	            this._oAddActionSheet.setContentWidth("" + w + "px");
	        }
	    },
	    onAddButtonPressed: function (e) {
	        this.createAddActionSheet();
	        this._oAddActionSheet.setTitle(null);
	        this._oAddActionSheet.openBy(e.getSource());
	    },
	    onAddFromExistingProject: function () {
	        if (!this._oAssignmentDialog) {
	            this._oAssignmentDialog = new sap.m.Dialog({
	                showHeader: false,
	                contentWidth: "1100px",
	                contentHeight: "670px"
	            });
	            var c = sap.ui.view({
	                type: sap.ui.core.mvc.ViewType.XML,
	                viewName: "mrs.resourcemanagement.view.myschedule.SelfBookingExistingProject",
	                width: "100%",
	                height: "100%"
	            });
	            this.getView().addDependent(this._oAssignmentDialog);
	            this._oAssignmentDialog.addContent(c);
	        }
	        this._oAssignmentDialog.open();
	        if (!this._oAssignmentDialog.isOpen()) {
	            var i = mrs.resourcemanagement.Util.Util.getCurrentUser();
	            this._oAssignmentDialog.getController().setConsultantData(i);
	            this._oAssignmentDialog.open();
	        }
	    },
	    onSelfBookingRequest: function () {
	        this.oRouter.navTo("selfBookingRequest", {}, false);
	    }
});