/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.RoleBusinessRules");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateOtherBookingCustom", {
			onInit: function() {
				// this._Parameter = this.getOwnerComponent().getComponentData().startupParameters.pernr[0];
				this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle();
				this._data = sap.ui.getCore().getModel("globalModel").getData();
				// this._check1 = sap.ui.getCore().getModel("check_model").getData();
				this._eModel = new sap.ui.model.json.JSONModel();
				// this._emodel = new sap.ui.model.json.JSONModel();
				// var D = new Date(this.byId("otherBookingStartEndDate").mProperties.dateValue);
				// 	var D1 = new Date(this.byId("otherBookingStartEndDate").mProperties.secondDateValue);
				// 	if (D) {
				// 	var oCurrentStartDate = new Date(new Date().getFullYear(), 0, 1);
				// }
				// if (D1) {
				// 	var oCurrentEndDate = new Date(new Date().getFullYear(), 11, 31);
				// }
				// this.loadAssignmentsForDateRange1(oCurrentStartDate, oCurrentEndDate);
				// var D;
				//this._emodel	=	sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
				// 		.Constants.Events.DATA_CHANGED, D);
				this._oModel = this.getView().getModel("viewData");
				this.getView().setModel(new sap.ui.model.json.JSONModel({
					"isRecurVisible": true,
					"isVisible": false,
					"Mon": false,
					"Tue": false,
					"Wed": false,
					"Thu": false,
					"Fri": false,
					"Sat": false,
					"Sun": false,
					"FullWorkingDay": false,
					"StartDate": null,
					"EndDate": null,
					"isEdit": false,
					"ShowAsAvailable": false,
					"OtherBookingTypeDesc": false,
					"OtherBookingType": false
				}), "OtherBookingModel");
				this._csrfToken = this.fnCsrfFetch();
			},
			fnCsrfFetch: function() {
				var gatewayUrl = "https://staffitint.deloitteresources.com/sap/opu/odata/sap/ZMRSV_RM_TIMEALLOCATION_SRV";
				var csrfToken;
				var that = this;
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
			onAfterRendering: function() {
				if (this.getView().getModel("OtherBookingModel").getData().isEdit) {
					if (this.getView().getModel("CandidateModel").getData().PersonSet.ResourceType === "00") {
						this.getView().byId("otherBookingTypeSelection").setValue(this.getView().getModel("AssignmentModel").getData().OtherBookingTypeDesc);
						this.getView().byId("otherBookingTypeSelection").setSelectedKey(this.getView().getModel("AssignmentModel").getData().OtherBookingType)
					} else {
						this.getView().byId("otherBookingTypeSelectionNN").setValue(this.getView().getModel("AssignmentModel").getData().OtherBookingTypeDesc);
						this.getView().byId("otherBookingTypeSelectionNN").setSelectedKey(this.getView().getModel("AssignmentModel").getData().OtherBookingType)
					}
				} else if (this.getView().getModel("CandidateModel").getData().PersonSet.ResourceType === "00") {
					this.getView().byId("otherBookingTypeSelection").setSelectedItem(this.getView().byId("otherBookingTypeSelection").getList().getItems()[
						0])
				} else {
					this.getView().byId("otherBookingTypeSelectionNN").setSelectedItem(this.getView().byId("otherBookingTypeSelectionNN").getList().getItems()[
						0])
				}
				this.getView().getModel("OtherBookingModel").setProperty("/StartDate", null);
				this.getView().getModel("OtherBookingModel").setProperty("/EndDate", null);
				this.getView().getModel("AssignmentModel").refresh(true);
				if (this.getView().getModel("AssignmentModel").getData().StartDate.getTime() !== 253402218061000) {
					this.getView().byId("otherBookingStartEndDate").setDateValue(this.getView().getModel("AssignmentModel").getData().StartDate);
					this.getView().byId("otherBookingStartEndDate").setSecondDateValue(this.getView().getModel("AssignmentModel").getData().EndDate)
				}
				this.resourceBundlei18n = this.getView().getModel("i18n").getResourceBundle()
			},
			resetValidateStateInput: function() {
				var m = this;
				jQuery.each([m.byId("assignmentAssignedDaysInput"), m.byId("otherBookingStartEndDate")], function(i, a) {
					a.setValueState("None")
				});
				if (m.getView().getModel("CandidateModel").getData().PersonSet.ResourceType === "00") {
					m.byId("otherBookingTypeSelection").removeStyleClass("inputError")
				} else {
					m.byId("otherBookingTypeSelectionNN").removeStyleClass("inputError")
				}
			},
			isValidateAssignmentInput: function() {
				var m = this;
				return mrs.resourcemanagement.Util.Util.validateForm(function() {
					return [m.byId("assignmentAssignedDaysInput"), m.byId("otherBookingStartEndDate")]
				}, function() {
					if (m.getView().getModel("CandidateModel").getData().PersonSet.ResourceType === "00") {
						return [m.byId("otherBookingTypeSelection")]
					} else {
						return [m.byId("otherBookingTypeSelectionNN")]
					}
				})
			},
			isValidateInput: function() {
				var v = true;
				var c = this.getView().getContent()[0].getItems()[0].getItems()[1].getItems()[0].getItems()[0];
				var h = c.getItems()[4].getItems()[0].getItems()[1];
				var w = c.getItems()[1].getItems()[0].getItems()[2];
				var d = c.getItems()[3].getItems()[0].getItems();
				if (this.getView().getModel("OtherBookingModel").getProperty("/isVisible")) {
					if (!d[1].getSelected() && !d[2].getSelected() && !d[3].getSelected() && !d[4].getSelected() && !d[5].getSelected() && !d[6].getSelected() &&
						!d[0].getSelected()) {
						sap.m.MessageToast.show(this.resourceBundlei18n.getText("ERROR_MESSAGE_DAY_CHECKBOX"));
						v = false;
					}
					var f = this.getView().getModel("OtherBookingModel").getProperty("/FullWorkingDay");
					if (h.getValue() === "" || h.getValue() <= 0 || h.getValue() > 24) {
						if (!f) {
							h.setValueState(sap.ui.core.ValueState.Error);
							v = false;
						} else {
							h.setValueState("None");
						}
					} else {
						h.setValueState("None");
					}
					if (w.getValue() === "" || w.getValue() <= 0 || w.getValue() > 99) {
						w.setValueState(sap.ui.core.ValueState.Error);
						v = false;
					} else {
						w.setValueState("None");
					}
				}
				return v;
			},
			enableAssignedDaysFormatter: function(i) {
				return !i;
			},
			Delete_CheckboxPress: function(e) {
				// if (e.getSource().getSelected()) {
				// 	// var h, w;
				// 	// var c = this.getView().getContent()[0].getItems()[0].getItems()[1].getItems()[0].getItems()[0];
				// 	// // this.getView().getId("check1").setEnabled(false);
				this.getView().getModel("OtherBookingModel").setProperty("/ShowAsAvailable", true);
				// 	// h = c.getItems()[4].getItems()[0].getItems()[1];
				// 	// w = c.getItems()[1].getItems()[0].getItems()[2];
				// 	// h.setValue(0);
				// 	// w.setValue(0);
				// }

			},

			deleteAssignment: function() {
				if (this.getView().byId("Delete_check").getSelected() === true) {
					// this.getView().getId("otherBookingStartEndDate").setEnabled(false);
					this._data = sap.ui.getCore().getModel("globalModel").getData();
					var Pernr = this._data.data[0].ConsultantID;
					// var p1 = this.byId("otherBookingStartEndDate");

					var D = new Date(this.byId("otherBookingStartEndDate").mProperties.dateValue);
					var m = D.toISOString();
					var M = D.toDateString();
					var date_strt = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
					var D1 = new Date(this.byId("otherBookingStartEndDate").mProperties.secondDateValue);
					m = D1.toISOString();
					M = D1.toDateString();
					if (parseInt(date_strt.substring(6, 7)) < parseInt(D.toLocaleDateString().substring(0, 1))) {
						var mid = parseInt(date_strt.substring(6, 7)) + 1;
						date_strt = date_strt.substring(0, 6) + mid + date_strt.substring(7, 19);}
						// var d1 = D1.toISOString();
						var date_end = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
						if (parseInt(date_end.substring(6, 7)) < parseInt(D1.toLocaleDateString().substring(0, 1))) {
							var mid = parseInt(date_end.substring(6, 7)) + 1;
							date_end = date_end.substring(0, 6) + mid + date_end.substring(7, 19);}
							var T1 = this.getView().byId("otherBookingTypeSelection1").getSelectedKey();
							var arr;
							var duration = "0";
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
										"Duration": duration
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

							// sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
							// 	.Constants.Events.DATA_CHANGED, D);
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
									var success = oData;
									that.getView().byId("otherBookingTypeSelection").setSelectedKey();
									that.getView().byId("otherBookingTypeSelectionNN").setSelectedKey();
									var s = that.getView().getContent()[0].getItems()[0].getItems()[1].getItems()[0].getItems()[0].getItems()[3].getItems()[0].getItems();
									for (var i = 0; i < 7; i++) {
										s[i].setSelected(false);
									}
									that.getView().getModel("OtherBookingModel").setProperty("/isVisible", false);
									// mrs.resourcemanagement.Util.Util.showBusyDialog();

									sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("ASSIGNMENT_DELETE_CONFIRMATION_BUTTON"), {
										closeOnBrowserNavigation: false
									});
									mrs.resourcemanagement.Util.Util.hideBusyDialog();

									// that.getView().getParent().exit();
									sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement
										.Util.Constants.Events.ASSIGNMENT_UPDATED, oData)
									try {
										that.getView().getParent().getParent().getParent().getParent().exit();
									} catch (e) {}
								},
								function(oError) {
									var error = oError;
									mrs.resourcemanagement.Util.Util.hideBusyDialog();
									mrs.resourcemanagement.Util.Util.showErrorMessage(error);
								}, this);

						} else {
							alert("Please select delete check box if you want to delete");
						}
					},
					onCancelDialog: function() {
							this.getView().getParent().close();
						},

						// },
						onRecurCheckboxPress: function(e) {
							if (e.getSource()) {
								var h, w;
								this.getView().getModel("OtherBookingModel").setProperty("/FullWorkingDay", false);
								var c = this.getView().getContent()[0].getItems()[0].getItems()[1].getItems()[0].getItems()[0];
								if (e.getSource().getSelected()) {
									this.getView().getModel("AssignmentModel").setProperty("/Duration", "0");
									h = c.getItems()[4].getItems()[0].getItems()[1];
									w = c.getItems()[1].getItems()[0].getItems()[2];
									h.setValue(1);
									w.setValue(1);
									this.getView().byId("Delete_check").setEnabled(false);
									this.getView().byId("otherBookingTypeSelection1").setEnabled(false);
								} else {
									this.getView().getModel("OtherBookingModel").setProperty("/FullWorkingDay", false);
									h = c.getItems()[4].getItems()[0].getItems()[1];
									w = c.getItems()[1].getItems()[0].getItems()[2];
									h.setValue(0);
									w.setValue(0);
									this.getView().byId("Delete_check").setEnabled(true);
									this.getView().byId("otherBookingTypeSelection1").setEnabled(true);
								}
							}
						},
						enableHrsPerDayFormatter: function(i) {
							if (i === true && typeof(this.getView().getModel("AssignmentModel")) !== "undefined") {
								this.getView().getModel("AssignmentModel").setProperty("/NoofHoursPerDay", "0");
							} else if (i === false && typeof(this.getView().getModel("AssignmentModel")) !== "undefined") {
								this.getView().getModel("AssignmentModel").setProperty("/NoofHoursPerDay", "1");
							}
							return !i;
						},
						validateDuration: function() {
							var v = true;
							if (!this.getView().getModel("OtherBookingModel").getProperty("/isVisible")) {
								var a = parseInt(this.getView().byId("assignmentAssignedDaysInput").getValue(), 10);
								if (this.getView().byId("assignmentAssignedDaysInput").getValue() === "" || a <= 0) {
									this.getView().byId("assignmentAssignedDaysInput").setValueState("Error");
									v = false;
								} else {
									this.getView().byId("assignmentAssignedDaysInput").setValueState("None");
								}
							}
							return v;
						},
						isValidateAssignedDays: function() {
							var t = this;
							return mrs.resourcemanagement.Util.Util.validateAssignedDays(t.getView().byId("assignmentAssignedDaysInput"))
						},
						updateAssignmentModel: function() {
							this.getView().getModel("AssignmentModel").getData().EndDate = this.getView().getModel("OtherBookingModel").getData().EndDate;
							this.getView().getModel("AssignmentModel").getData().StartDate = this.getView().getModel("OtherBookingModel").getData().StartDate;
						},
						setAssignment: function(e) {
							var k = e.getSource().getSelectedKey();
							this.getView().getModel("AssignmentModel").setProperty("/OtherBookingType", k);
						},
						check_exist: function() {

						},
						createAssignment: function() {
							if (this._data.data[0].ConsultantID)
							// var p = mrs.resourcemanagement.Util.Util.getCurrentUser();
								var p = this._data.data[0].ConsultantID;
							// var p = "00018391";
							var p1 = this.byId("otherBookingStartEndDate");
							var Pernr = p;
							var D = new Date(this.byId("otherBookingStartEndDate").mProperties.dateValue);
							// var Date_local = D.toLocaleDateString();
							var m = D.toISOString();
							var M = D.toDateString();
							var date_strt = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
							if (parseInt(date_strt.substring(6, 7)) < parseInt(D.toLocaleDateString().substring(0, 1))) {
								var mid = parseInt(date_strt.substring(6, 7)) + 1;
								date_strt = date_strt.substring(0, 6) + mid + date_strt.substring(7, 19);
							}
							// date_strt
							// var date_strt = "Date("+D.getTime() +")";
							var D1 = new Date(this.byId("otherBookingStartEndDate").mProperties.secondDateValue);
							m = D1.toISOString();
							M = D1.toDateString();
							var IsRecurring = this.getView().getModel("OtherBookingModel").getProperty("/isVisible");
							// if (IsRec === true)
							// 	var IsRecurring = "X";
							var RequestNumber = "";
							var Weekday_Monday = this.getView().getModel("OtherBookingModel").getProperty("/Mon");
							var Weekday_Tuesday = this.getView().getModel("OtherBookingModel").getProperty("/Tue");
							var Weekday_Wednesday = this.getView().getModel("OtherBookingModel").getProperty("/Wed");
							var Weekday_Thursday = this.getView().getModel("OtherBookingModel").getProperty("/Thu");
							var Weekday_Friday = this.getView().getModel("OtherBookingModel").getProperty("/Fri");
							var Weekday_Saturday = this.getView().getModel("OtherBookingModel").getProperty("/Sat");
							var Weekday_Sunday = this.getView().getModel("OtherBookingModel").getProperty("/Sun");
							var FullWorkingDay = this.getView().getModel("OtherBookingModel").getProperty("/FullWorkingDay");
							var RecurringPerWeek = parseInt(this.getView().getModel("AssignmentModel").getProperty("/RecurringPerWeek"), 10);
							// "/Date(1502236800000)/"
							// var R = "" + RecurringPerWeek + "";
							// if (FullWork === true)
							// 	var FullWorkingDay = "X";
							// n.RecurringPerWeek = parseInt(this.getView().getModel("AssignmentModel").getProperty("/RecurringPerWeek"), 10);
							// var d1 = D1.toISOString();
							// var date_end = "/Date("+D1.getTime() +")/";
							var date_end = m.substring(0, 8) + M.substring(8, 10) + m.substring(10, 19);
							if (parseInt(date_end.substring(6, 7)) < parseInt(D1.toLocaleDateString().substring(0, 1))) {
								var mid = parseInt(date_end.substring(6, 7)) + 1;
								date_end = date_end.substring(0, 6) + mid + date_end.substring(7, 19);
							}
							var T1 = this.getView().byId("otherBookingTypeSelection").getSelectedKey();
							var duration = this.byId("assignmentAssignedDaysInput").mProperties.value;
							var text = this.byId("txtarea").getValue();
							// var Operation = "D";
							var check2 = this.byId("check2");
							if (check2.getSelected() === true)
								var val = "X";

							// this.isValidateAssignmentInput()
							// }else{
							if (this.validateDuration() && this.isValidateInput()) {

								var p = this.getView().getModel("OtherBookingModel").getProperty("/");
								var I = Object.keys(p);
								for (var i = 2; i < 9; i++) {
									if (p[I[i]]) {
										p[I[i]] = "X";
									} else {
										p[I[i]] = "";
									}
								}
								var d = this.getView().getModel();
								this.getView().getModel("AssignmentModel").setProperty("/StartDate", p.StartDate);
								this.getView().getModel("AssignmentModel").setProperty("/EndDate", p.EndDate);
								var n = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentForSaving(this.getView().getModel("AssignmentModel").getProperty(
									"/"));
								n.AssignmentType = mrs.resourcemanagement.Util.Constants.AssignmentType.OTHER;
								n.IsRecurring = this.getView().getModel("OtherBookingModel").getProperty("/isVisible");
								n.RequestNumber = "";
								n["Weekday_Monday"] = this.getView().getModel("OtherBookingModel").getProperty("/Mon");
								n["Weekday_Tuesday"] = this.getView().getModel("OtherBookingModel").getProperty("/Tue");
								n["Weekday_Wednesday"] = this.getView().getModel("OtherBookingModel").getProperty("/Wed");
								n["Weekday_Thursday"] = this.getView().getModel("OtherBookingModel").getProperty("/Thu");
								n["Weekday_Friday"] = this.getView().getModel("OtherBookingModel").getProperty("/Fri");
								n["Weekday_Saturday"] = this.getView().getModel("OtherBookingModel").getProperty("/Sat");
								n["Weekday_Sunday"] = this.getView().getModel("OtherBookingModel").getProperty("/Sun");
								n["FullWorkingDay"] = this.getView().getModel("OtherBookingModel").getProperty("/FullWorkingDay");
								n.RecurringPerWeek = parseInt(this.getView().getModel("AssignmentModel").getProperty("/RecurringPerWeek"), 10);
								var l = new Date(0).getTimezoneOffset();
								n.ClientTimeZone = l.toString();

								mrs.resourcemanagement.Util.Util.showBusyDialog();
								var oCreatePayload = {
									"d": {
										"CandidateId": Pernr,
										"TimespecType": T1,
										"Description": text,
										"BegTstmp": date_strt,
										"EndTstmp": date_end,
										"Duration": duration,
										"Available": val,
										"IsRecurring": IsRecurring,
										"FullWorkingDay": FullWorkingDay,
										"RecurringPerWeek": RecurringPerWeek,
										"NoofHoursPerDay": 2,
										"RMonday": Weekday_Monday,
										"RTuesday": Weekday_Tuesday,
										"RWednesday": Weekday_Wednesday,
										"RThursday": Weekday_Thursday,
										"RFriday": Weekday_Friday,
										"RSaturday": Weekday_Saturday,
										"RSunday": Weekday_Sunday
									}
								};
								var oPostModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMRSV_RM_TIMEALLOCATION_SRV", true, {
									"Content-Type": "application/json",
									"X-Requested-With": "JSONHttpRequest",
									"X-CSRF-TOKEN": this._csrfToken
								});
								var oPostPath = "ETS_MASS_TA";
								var that = this;
								oPostModel.create(oPostPath, oCreatePayload, null,
									function(oData) {
										var success = oData;
										that.getView().byId("otherBookingTypeSelection").setSelectedKey();
										that.getView().byId("otherBookingTypeSelectionNN").setSelectedKey();
										var s = that.getView().getContent()[0].getItems()[0].getItems()[1].getItems()[0].getItems()[0].getItems()[3].getItems()[0].getItems();
										for (var i = 0; i < 7; i++) {
											s[i].setSelected(false)
										}
										that.getView().getModel("OtherBookingModel").setProperty("/isVisible", false);
										mrs.resourcemanagement.Util.Util.hideBusyDialog();
										sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("BOOKING_SAVE_SUCCESS"), {
											closeOnBrowserNavigation: false
										});

										sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
											.Constants.Events.ASSIGNMENT_SAVED, oData);
										// sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
										// .Constants.Events.ASSIGNMENT_UPDATED, oData);
										try {
											that.getView().getParent().getParent().getParent().getParent().close()
										} catch (e) {}
									},
									function(oError) {
										var error = oError;
										mrs.resourcemanagement.Util.Util.hideBusyDialog();
										mrs.resourcemanagement.Util.Util.showErrorMessage(error);
									});
							}
						}
				});