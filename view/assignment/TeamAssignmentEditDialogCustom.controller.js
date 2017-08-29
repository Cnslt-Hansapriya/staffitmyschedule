/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.TeamAssignmentEditDialogCustom", {
	onInit: function() {

		this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle();
		this._csrfToken = this.fnCsrfFetch();
		this._data = sap.ui.getCore().getModel("globalModel").getData();
		this._d;
		this._val;
	},
	onEditAssignment: function(d) {
		var p = this.byId("editAssignmentPage");
		this.byId("concreteAssignment").setVisible(false);
		this.byId("capacitiveAssignment").setVisible(false);
		this.byId("stretchedAssignment").setVisible(false);
		this.byId("otherBooking").setVisible(false);
		this._d = d;
		switch (d.AssignmentType) {
			case mrs.resourcemanagement.Util.Constants.AssignmentType.CAPACITIVE:
				this.editAssignmentView = this.byId("capacitiveAssignment");
				this.byId("capacitiveAssignment").setVisible(true);
				p.setTitle(this.resourceBundle.getText("ASSIGNMENT_CAPACITIVE_EDIT"));
				this.editAssignmentView.byId("displayTimeRulesCheck").setVisible(false);
				this.editAssignmentView.byId("displayTimeRules").setVisible(false);
				this.editAssignmentView.byId("assignmentAssignedDaysInput").setEnabled(true);
				break;
			case mrs.resourcemanagement.Util.Constants.AssignmentType.STRETCHED:
				this.editAssignmentView = this.byId("stretchedAssignment");
				this.byId("stretchedAssignment").setVisible(true);
				p.setTitle(this.resourceBundle.getText("ASSIGNMENT_STRETCHED_EDIT"));
				this.editAssignmentView.byId("displayStretchedTimeRulesCheck").setVisible(false);
				this.editAssignmentView.byId("displayTimeRules").setVisible(false);
				this.editAssignmentView.byId("bookingAssignedDaysInput").setEnabled(true);
				break;
			case mrs.resourcemanagement.Util.Constants.AssignmentType.CONCRETE:
				this.editAssignmentView = this.byId("concreteAssignment");
				this.byId("concreteAssignment").setVisible(true);
				p.setTitle(this.resourceBundle.getText("ASSIGNMENT_CONCRETE_EDIT"));
				this.editAssignmentView.byId("displayTimeRulesConcreteCheck").setVisible(false);
				this.editAssignmentView.byId("displayTimeRules").setVisible(false);
				this.editAssignmentView.byId("assignmentAssignedDaysInput").setEnabled(true);
				break;
			case mrs.resourcemanagement.Util.Constants.AssignmentType.OTHER:
			default:
				this.editAssignmentView = this.byId("otherBooking");
				this.byId("otherBooking").setVisible(true);
				p.setTitle(this.resourceBundle.getText("ASSIGNMENT_OTHER_EDIT"));
				this.editAssignmentView.getModel("OtherBookingModel").setProperty("/isRecurVisible", false);
				this.editAssignmentView.getModel("OtherBookingModel").setProperty("/isEdit", true);
				this._data = sap.ui.getCore().getModel("globalModel").getData();
				this._val = d.OtherBookingType;
				this._sdate = d.EndDate;
				this._edate = d.StartDate;
				this.editAssignmentView.byId("otherBookingTypeSelection").setSelectedKey(this._val);
				this.editAssignmentView.byId("otherBookingTypeSelection1").setSelectedKey("");
				this.editAssignmentView.byId("Delete_check").setSelected(false);
				this.editAssignmentView.byId("otherBookingTypeSelection").setEnabled(false);
				break;
		}
		this.oLocalDataModel = new sap.ui.model.json.JSONModel();
		this.originalData = d;
		this.oLocalDataModel.setData($.extend(true, {}, d));
		this.getView().setModel(this.oLocalDataModel, "AssignmentModel");
	},
	onCancelDialog: function() {
		this.getView().getParent().close()
	},
	_getAssignmentPath: function() {
		var s = this.originalData.StartDate;
		var e = this.originalData.EndDate;
		if (this.originalData.StartDate) {
			s = mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(this.originalData.StartDate)
		}
		if (this.originalData.EndDate) {
			e = mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(this.originalData.EndDate)
		}
		return "/AssignmentSet(ConsultantID='" + this.originalData.ConsultantID + "',RequestNumber='" + this.originalData.RequestNumber +
			"',RoleNumber='" + this.originalData.RoleNumber + "',SPGroup='" + this.originalData.SPGroup + "',StartDate=datetimeoffset'" + new Date(
				s.getTime()).toJSON() + "',EndDate=datetimeoffset'" + new Date(e.getTime()).toJSON() + "',AssignmentType='" + this.originalData.AssignmentType +
			"',OtherBookingType='" + this.originalData.OtherBookingType + "',FourByTenIndicator=" + (this.originalData.FourByTenIndicator ? true :
				false) + ",SettlementType='" + this.originalData.SettlementType + "')"
	},
	onDeleteAssignment: function(e) {

		mrs.resourcemanagement.Util.Util.confirmPopover(e.getSource(), $.proxy(function() {
			if (this._d.AssignmentType === "O") {
			if (this.editAssignmentView.byId("Delete_check").getSelected() === true) {
				
					var h = this.editAssignmentView;

					var d = this.getView().getModel();
					// h.byId("assignmentAssignedDaysInput").setSelected(false);
					var n = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentForSaving(this.getView().getModel("AssignmentModel").getProperty(
						"/"));
					// var p = mrs.resourcemanagement.Util.Util.getCurrentUser();

					// var p1 = h.byId("otherBookingStartEndDate");
					var Pernr = this._data.data[0].ConsultantID;
					var D = new Date(h.byId("otherBookingStartEndDate").mProperties.dateValue);
					var m = D.toISOString();
					var M = D.toDateString();
					var date_strt = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19)
					var D1 = new Date(h.byId("otherBookingStartEndDate").mProperties.secondDateValue);
					m = D1.toISOString();
					M = D1.toDateString();
					if (parseInt(date_strt.substring(6, 7)) < parseInt(D.toLocaleDateString().substring(0, 1))) {
						var mid = parseInt(date_strt.substring(6, 7)) + 1;
						date_strt = date_strt.substring(0, 6) + mid + date_strt.substring(7, 19);
					}
					var date_end = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
					if (parseInt(date_end.substring(6, 7)) < parseInt(D1.toLocaleDateString().substring(0, 1))) {
						 mid = parseInt(date_end.substring(6, 7)) + 1;
						date_end = date_end.substring(0, 6) + mid + date_end.substring(7, 19);
					}
					// var d1 = D1.toISOString();
					// var date_end = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
					var T1 = h.byId("otherBookingTypeSelection1").getSelectedKey();
					// var duration = h.byId("assignmentAssignedDaysInput").mProperties.value;
					// var text = h.byId("txtarea").getValue();
					// var Operation = "D";
					// var check2 = this.byId("check2");
					// if (check2.getSelected() === true)
					// var val = "X";
					var p = this._getAssignmentPath();

					delete n.duration;
					delete n.RequestRoleNumber;
					var arr;
					var arr1 = [];
					for (var j = 0; j < this._data.data.length; j++) {
						arr = this._data.data[j];
						// var	Demand = "guid\\'"+ arr.DemandKey+ "\\'";
						// arr.DemandKey;
						var Demand = new sap.ui.model.odata.type.Guid();
						// Demand.parseValue(arr.DemandKey,"string");

						if (arr.AssignmentType === "O" && arr.OtherBookingType === T1 && D <= arr.StartDate && D1 >= arr.StartDate) {
							arr1.push({
								"Operation": "U",
								"TimespecKey": Demand.parseValue(arr.DemandKey, "string"),
								"Duration": "0"
							});

						}

					}
					var oCreatePayload = {
						"d": {
							"CandidateId": Pernr,
							"BegTstmp": date_strt,
							"EndTstmp": date_end,
							"NV_MULTI_TA": arr1
						}
					};

					var oPostModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMRSV_RM_TIMEALLOCATION_SRV", true, {
						"Content-Type": "application/json",
						"X-Requested-With": "JSONHttpRequest",
						"X-CSRF-TOKEN": this._csrfToken
					});
					var oPostPath = "ETS_HEADER";
					var that = this;
					mrs.resourcemanagement.Util.Util.showBusyDialog();
					oPostModel.create(oPostPath, oCreatePayload, null,
						function(oData) {
							// var success = oData;
							mrs.resourcemanagement.Util.Util.hideBusyDialog();
							that.onCancelDialog();
							sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement
								.Util
								.Constants.Events.ASSIGNMENT_UPDATED, oData);
						},
						function(oError) {
							var error = oError;
							mrs.resourcemanagement.Util.Util.hideBusyDialog();
							mrs.resourcemanagement.Util.Util.showErrorMessage(error);
						});

				}  
				else if (this.editAssignmentView.byId("Delete_check").getSelected() === false){}}
				else {

					var p = this._getAssignmentPath();
					var d = this.getView().getModel();
					mrs.resourcemanagement.Util.Util.showBusyDialog();
					d.remove(p, {
						success: jQuery.proxy(function(D) {
							mrs.resourcemanagement.Util.Util.hideBusyDialog();
							this.onCancelDialog();
							sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement
								.Util.Constants.Events.ASSIGNMENT_DELETED, D)
						}, this),
						error: jQuery.proxy(function(E) {
							mrs.resourcemanagement.Util.Util.hideBusyDialog();
							mrs.resourcemanagement.Util.Util.showErrorMessage(E)
						}, this)
					});

				}
			 
				// this.editAssignmentView.byId("assignmentAssignedDaysInput").setSelected(true);
			// } else {
			// 	alert("Please select Delete checkbox");
			// }
		}, this), this.resourceBundle.getText("ASSIGNMENT_DELETE_CONFIRMATION_BUTTON"), this.getView(), "Top")
	},
	fnCsrfFetch: function() {
		var gatewayUrl = "https://staffitint.deloitteresources.com/sap/opu/odata/sap/ZMRSV_RM_TIMEALLOCATION_SRV";
		var csrfToken;
		// var that = this;
		var aData = jQuery.ajax({
			url: gatewayUrl,
			headers: {
				"X-CSRF-Token": "Fetch",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0"
			},
			async: false,
			type: "GET",
			contentType: "application/json",
			dataType: 'json',
			success: function(data, textStatus,
				request) {
				csrfToken = request.getResponseHeader('x-csrf-token');
				//	var oView = that.getView();
				//	oView.byId("smartTblTest").setEntitySet("ETS_PEOPLE_WORKLIST");

			}
		});
		return csrfToken;
	},
	onSaveAssignment: function() {
		if (this.editAssignmentView.getController().isValidateAssignedDays()) {
			if (this._d.AssignmentType === "O") {
				var h = this.editAssignmentView;

				var d = this.getView().getModel();
				var n = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentForSaving(this.getView().getModel("AssignmentModel").getProperty(
					"/"));
				// var p = mrs.resourcemanagement.Util.Util.getCurrentUser();
				// var p1 = h.byId("otherBookingStartEndDate");
				var Pernr = this._data.data[0].ConsultantID;
				var D = new Date(h.byId("otherBookingStartEndDate").mProperties.dateValue);
				var m = D.toISOString();
				var M = D.toDateString();
				var date_strt = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19)
				var D1 = new Date(h.byId("otherBookingStartEndDate").mProperties.secondDateValue);
				m = D1.toISOString();
				M = D1.toDateString();
				var desc = h.byId("txtarea").getValue();
					if (parseInt(date_strt.substring(6, 7)) < parseInt(D.toLocaleDateString().substring(0, 1))) {
						var mid = parseInt(date_strt.substring(6, 7)) + 1;
						date_strt = date_strt.substring(0, 6) + mid + date_strt.substring(7, 19);
					}
				// var d1 = D1.toISOString();
				var date_end = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19)
					if (parseInt(date_end.substring(6, 7)) < parseInt(D1.toLocaleDateString().substring(0, 1))) {
						var mid = parseInt(date_end.substring(6, 7)) + 1;
						date_end = date_end.substring(0, 6) + mid + date_end.substring(7, 19);
					}
				var T1 = h.byId("otherBookingTypeSelection").getSelectedKey();
				var duration = h.byId("assignmentAssignedDaysInput").mProperties.value;
				// if (this._val !== h.byId("otherBookingTypeSelection").getSelectedKey() && this._d.EndDate !== h.byId("otherBookingStartEndDate").mProperties
				// 	.secondDateValue && this._d.StartDate !== h.byId("otherBookingStartEndDate").mProperties.dateValue) {
				// alert("Hey");
				var p = this._getAssignmentPath();
				mrs.resourcemanagement.Util.Util.showBusyDialog();
				delete n.duration;
				delete n.RequestRoleNumber;
				var arr;
				var arr1 = [];

				var Timespec = h.byId("otherBookingTypeSelection").getSelectedKey();
				// var duration = h.byId("assignmentAssignedDaysInput").mProperties.value;
				// var text = h.byId("txtarea").getValue();
				// var Operation = "D";
				var check2 = h.byId("check2");
				if (check2.getSelected() === true)
					var val = "X";
				var p = this._getAssignmentPath();
				mrs.resourcemanagement.Util.Util.showBusyDialog();
				delete n.duration;
				delete n.RequestRoleNumber;
				var arr;
				var arr1 = [];
				for (var j = 0; j < this._data.data.length; j++) {
					arr = this._data.data[j];
					// var	Demand = "guid\\'"+ arr.DemandKey+ "\\'";
					// arr.DemandKey;
					var Demand = new sap.ui.model.odata.type.Guid();
					// Demand.parseValue(arr.DemandKey,"string");

					if (arr.AssignmentType === "O" && arr.OtherBookingType === T1 && D <= arr.StartDate && D1 >= arr.StartDate) {
						arr1.push({
							"Operation": "U",
							"TimespecKey": Demand.parseValue(arr.DemandKey, "string"),
							"Duration": "0"
						});

					}

				}
				var arr2;
				arr2 = {
					"CandidateId": Pernr,
					"TimespecType": Timespec,
					"Description": desc,
					"BegTstmp": date_strt,
					"EndTstmp": date_end,
					"Duration": duration,
					"Available": val
				};
				var oCreatePayload = {
					"d": {
						"CandidateId": Pernr,
						"BegTstmp": date_strt,
						"EndTstmp": date_end,
						"NV_MASS_TA": arr2,
						"NV_MULTI_TA": arr1
					}
				};

				var oPostModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMRSV_RM_TIMEALLOCATION_SRV", true, {
					"Content-Type": "application/json",
					"X-Requested-With": "JSONHttpRequest",
					"X-CSRF-TOKEN": this._csrfToken
				});
				var oPostPath = "ETS_HEADER";
				var that = this;
				oPostModel.create(oPostPath, oCreatePayload, null,
					function(oData) {
						var success = oData;
						mrs.resourcemanagement.Util.Util.hideBusyDialog();
						// that.onCancelDialog();
						sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
							.Constants.Events.ASSIGNMENT_UPDATED, oData);
						that.onCancelDialog();
					},
					function(oError) {
						var error = oError;
						mrs.resourcemanagement.Util.Util.hideBusyDialog();
						mrs.resourcemanagement.Util.Util.showErrorMessage(error);
					});
			} else {
				var d = this.getView().getModel();
				var n = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentForSaving(this.getView().getModel("AssignmentModel").getProperty(
					"/"));
				var p = this._getAssignmentPath();
				mrs.resourcemanagement.Util.Util.showBusyDialog();
				delete n.duration;
				delete n.RequestRoleNumber;
				d.update(p, n, {
					success: jQuery.proxy(function(D) {
						mrs.resourcemanagement.Util.Util.hideBusyDialog();
						this.onCancelDialog();
						sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement
							.Util
							.Constants.Events.ASSIGNMENT_UPDATED, D)
					}, this),
					error: jQuery.proxy(function(e) {
						mrs.resourcemanagement.Util.Util.hideBusyDialog();
						mrs.resourcemanagement.Util.Util.showErrorMessage(e)
					}, this)
				})
			}
		}

	}
});