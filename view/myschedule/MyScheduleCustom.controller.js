jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("mrs.resourcemanagement.control.calendar.Calendar");
jQuery.sap.require("mrs.resourcemanagement.control.calendar.store.EventStore");
jQuery.sap.require("mrs.resourcemanagement.control.calendar.model.EventModel");
jQuery.sap.require("mrs.resourcemanagement.control.HeaderData");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.model.MockAssignmentModel");
jQuery.sap.require("mrs.resourcemanagement.control.MonthlyCalendar");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
sap.ui
	.controller(
		"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.MyScheduleCustom", {
			// this._Parameter:null,
			onInit: function() {

				// start: Changes by Hansapriya
				var aData = [{
					aKey: "start",
					aName: "Change Assignment Start Date"
				}, {
					aKey: "end",
					aName: "Change Assignment End Date"
				}, {
					aKey: "edit",
					aName: "Edit Assignment Hours"
				}, {
					aKey: "recreate",
					aName: "Recreate Assignment"
				}];
				this.aEditMod = new sap.ui.model.json.JSONModel();
				var aEditData = this.aEditMod.getData();
				aEditData.aEdit = aData;
				this.aEditMod.setData(aEditData);
				this.aEditMod.refresh();

				var oAssignMod = new sap.ui.model.json.JSONModel({
					"vboxVisible": false
				});
				this.getView().setModel(oAssignMod, "AssignmentModel");

				// end: Changes by Hansapriya
				this._eModel = new sap.ui.model.json.JSONModel();
				var oModel = new sap.ui.model.json.JSONModel();
				this._check = "0";
				this._D = 0;
				// if(sap.ui.getCore().getModel("globalModel"))
				// this._data =
				// sap.ui.getCore().getModel("globalModel").getData();
				this._Parameter = this.getOwnerComponent()
					.getComponentData().startupParameters.pernr[0];
				oModel.oData = this._Parameter;
				sap.ui.getCore().setModel(oModel, "paramModel");
				this.resourceBundle = this.getView().getModel("i18n")
					.getResourceBundle();
				var c = this.getView().byId("calendarLayout1");
				jQuery.sap
					.require("mrs.resourcemanagement.control.calendar.EventRenderer");
				// sap.ui.getCore().byId("calendarLayout").getModel().refresh(true);

				var C = new mrs.resourcemanagement.control.MonthlyCalendar({
					month: new Date().getMonth(),
					year: new Date().getFullYear()
				});
				C.setModel(this._eModel);
				C.setAssignmentAdd(false);

				C
					.bindRecords(
						"/data",
						function() {
							return new mrs.resourcemanagement.control.calendar.model.EventModel()
								.bindProperty("StartDate",
									"StartDate")
								.bindProperty("EndDate",
									"EndDate")
								.bindProperty("Id",
									"DemandKey")
								.bindProperty("ResourceId",
									"ResourceKey")
								.bindProperty(
									"ColorCode",
									"ColorKey",
									function(v) {
										return /^#/
											.test(v) ? v : "#" + v;
									})
								.bindProperty(
									"Duration",
									"Duration",
									function(v) {
										return parseFloat(v);
									})
								.bindProperty(
									"DurationUnit",
									"DurationUnit")
								.bindProperty(
									"AssignmentPrefix",
									"SettlementType")
								.bindProperty(
									"IsHardbooked",
									"BookingType",
									function(v) {
										return v === mrs.resourcemanagement.Util.Constants.BookingTypeKey.HARDBOOKED;
									})
								.bindProperty(
									"IsSoftbooked",
									"BookingType",
									function(v) {
										return v === mrs.resourcemanagement.Util.Constants.BookingTypeKey.SOFTBOOKED;
									})
								.bindProperty("SubText",
									"AssignmentTypeDesc")
								.bindProperty("Text",
									"LocalClientName")
								.bindProperty("Editable",
									"IsEditable");
						});
				C
					.attachEvent(
						"select",
						jQuery
						.proxy(
							function(D) {
								var l = new sap.ui.model.json.JSONModel();
								var s = D
									.getParameters().record;
								var i = s
									.getBindingContext()
									.getObject();
								// if(sap.ui.getCore().getModel("globalModel"))
								// var p =
								// this._Parameter;
								var p = this._D;
								// var p=
								// sap.ui.getCore().getModel("Currentuser").getData();
								// var p =
								// mrs.resourcemanagement.Util.Util.getCurrentUser();
								if (!this.oShowDetailAssignment) {
									this.oShowDetailAssignment = sap.ui
										.xmlfragment(
											"mrs.resourcemanagement.view.assignment.TeamAssignmentDetailPopover",
											this);
									this
										.getView()
										.addDependent(
											this.oShowDetailAssignment);
								}
								l.setData(i);
								this
									.getView()
									.setModel(
										l,
										"details");
								var o = new sap.ui.model.json.JSONModel();
								o.setData({
									PersonSet: p
								});
								this
									.getView()
									.setModel(
										o,
										"CandidateModel");
								this.oShowDetailAssignment
									.openBy(D
										.getParameters().element);
							}, this));
				C
					.attachEvent(
						"display",
						jQuery
						.proxy(
							function(D) {
								var l = new sap.ui.model.json.JSONModel();
								var I = [];
								var t = 0;
								var s = D
									.getParameters().record;
								for (var i = 0; i < s.length; i++) {
									var o = s[i].record
										.getBindingContext();
									o.oModel
										.getProperty(o.sPath).duration = s[i].duration + o.oModel
										.getProperty(o.sPath).DurationUnit;
									t = t + parseFloat(s[i].duration);
									I
										.push(o.oModel
											.getProperty(o.sPath));
								}
								I.TotalHours = t
									.toFixed(2)
									.toString() + " " + s[0].record
									.getBindingContext().oModel
									.getProperty(s[0].record
										.getBindingContext().sPath).DurationUnit;
								I.element = D
									.getParameters().element;
								l.setData(I);
								this
									.getView()
									.setModel(
										l,
										"AssignmentDisplayModel");
								if (!this._oAssignDialog) {
									this._oAssignDialog = sap.ui
										.xmlfragment(
											"mrs.resourcemanagement.view.assignment.CandidateDisplayEditPopover",
											this);
									this
										.getView()
										.addDependent(
											this._oAssignDialog);
								}
								var a = l.getData();
								for (i = 0; i < a.length; i++) {
									if (a[i].AssignmentType === "O") {
										a[i].RequestRoleNumber = a[i].OtherBookingTypeDesc;
									} else {
										if (a[i].LocalClientName === "") {
											a[i].RequestRoleNumber = a[i].RoleName;
										} else {
											a[i].RequestRoleNumber = a[i].LocalClientName;
										}
									}
								}
								var m = new sap.ui.model.json.JSONModel({
									"results": a
								});
								this._oAssignDialog
									.getContent()[0]
									.getHeaderToolbar()
									.getContent()[0]
									.setText(this.resourceBundle
										.getText("CANDIDATE_TOTAL_HOURS") + " " + a.TotalHours);
								this._oAssignDialog
									.setModel(
										m,
										"AssignmentDataModel");
								var b = a.element;
								jQuery.sap
									.delayedCall(
										0,
										this,
										function() {
											this._oAssignDialog
												.openBy(b);
										});
							}, this));
				C
					.attachEvent(
						"add",
						jQuery
						.proxy(
							function(D) {
								this.oAddAssignmentWizard = new sap.m.Dialog({
									showHeader: false,
									contentWidth: "80%",
									contentHeight: "80%"
								});
								this.oAddAssignmentDialogView = sap.ui
									.view({
										type: sap.ui.core.mvc.ViewType.XML,
										viewName: "mrs.resourcemanagement.view.assignment.CreateOtherBookingDialog",
										width: "100%",
										height: "100%"
									});
								this.oAddAssignmentWizard
									.addContent(this.oAddAssignmentDialogView);
								this
									.getView()
									.addDependent(
										this.oAddAssignmentWizard);
								// if(sap.ui.getCore().getModel("globalModel"))
								// var p =
								// this._Parameter;
								var p = this._D;
								// var p=
								// sap.ui.getCore().getModel("Currentuser").getData();
								// var p =
								// mrs.resourcemanagement.Util.Util.getCurrentUser();
								sap.ui
									.getCore()
									.setModel(
										this._eModel,
										"globalModel");
								this.oAddAssignmentDialogView
									.getController()
									.setConsultantData(
										p);
								var s = D
									.getParameters().startDate;
								this.oAddAssignmentDialogView
									.getController()
									.setStartDate(
										s);
								this.oAddAssignmentWizard
									.open();
							}, this));
				jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(
						"mrs.resourcemanagement",
						"/resource/css/monthlyCalendar.css"), null,
					function() {
						c.addContent(C);
					});
				this.oFilterBarCtrl = this.getView().byId(
					"MyScheduleFilterBarView").getController();
				this.oFilterBarCtrl.setCalendar(C);
				var d = this.getView().getModel();
				mrs.resourcemanagement.Util.Util.showBusyDialog();

				this._csrfToken = this.fnCsrfFetch();

				var that = this;

				var path = "/PersonSet('" + this._Parameter + "')";
				d
					.read(
						path, {
							async: true,

							success: function(oData, response) {
								if (response.statusCode === 200) {
									that._check = "1";
									var D = oData;
									mrs.resourcemanagement.Util.Util
										.hideBusyDialog();
									mrs.resourcemanagement.Util.Util
										.setCurrentUser(D);
									that._D = D;
									// sap.ui.getCore().setModel(D,
									// "Currentuser");
									that.loadAssignments();
								}
							},
							error: function(oError) {
								sap.m.MessageToast
									.show("Could not retrieve data form server!");
							}
						});
				this.subscribeToEvents();
				// C.destroy();
				// sap.ui.getCore().setModel(this._eModel);
			},
			handleRouteMatched: function(e) {
				var Parameter;
				// if (e.getParameter("name") === "MySchedule") {
				Parameter = e.mParameters.arguments.id;
			},
			enableEditFormatter: function(B) {
				if (B === "5") {
					return false;
				} else {
					return true;
				}
			},
			subscribeToEvents: function() {
				// alert("Hey");
				sap.ui
					.getCore()
					.getEventBus()
					.subscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_SAVED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.subscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_UPDATED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.subscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_DELETED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.subscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.CALENDAR,
						mrs.resourcemanagement.Util.Constants.Events.YEAR_CHANGED,
						this.loadAssignmentsForYear, this);

			},
			unsubscribeToEvents: function() {
				sap.ui
					.getCore()
					.getEventBus()
					.unsubscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_SAVED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.unsubscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_UPDATED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.unsubscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT,
						mrs.resourcemanagement.Util.Constants.Events.ASSIGNMENT_DELETED,
						this.loadAssignments, this);
				sap.ui
					.getCore()
					.getEventBus()
					.unsubscribe(
						mrs.resourcemanagement.Util.Constants.EventChannels.CALENDAR,
						mrs.resourcemanagement.Util.Constants.Events.YEAR_CHANGED,
						this.loadAssignmentsForYear, this);

			},
			onPopoverDisplayPress: function(e) {
				var b = e.getSource();
				var l = new sap.ui.model.json.JSONModel();
				var p = e.getSource().getBindingContext(
					"AssignmentDataModel").sPath;
				var c = this._oAssignDialog.getModel(
					"AssignmentDataModel").getProperty(p);
				l.setData(c);
				// if(sap.ui.getCore().getModel("globalModel"))
				// var P = this._Parameter;
				var P = this._D;
				// var P=
				// sap.ui.getCore().getModel("Currentuser").getData();
				// var P =
				// mrs.resourcemanagement.Util.Util.getCurrentUser();
				this.getView().setModel(l, "details");
				var C = new sap.ui.model.json.JSONModel();
				C.setData({
					PersonSet: P
				});
				this.getView().setModel(C, "CandidateModel");
				if (!this.oDisplayDialog) {
					this.oDisplayDialog = sap.ui
						.xmlfragment(
							"TeamAssignmentDetailPopoverFragment",
							"mrs.resourcemanagement.view.assignment.TeamAssignmentDetailPopover",
							this);
					this.getView().addDependent(this.oDisplayDialog);
				}
				jQuery.sap.delayedCall(0, this, function() {
					this.oDisplayDialog.openBy(b);
				});
				this._oAssignDialog.setModal(true);
				this.oDisplayDialog.openBy(b);
			},
			onAfterClose: function() {
				if (this._oAssignDialog !== undefined)
					this._oAssignDialog.setModal(false);
			},
			onPopoverEditPress: function(e) {
				// Changes by Hansapriya
				alert("EditTriggered ");
				var l = new sap.ui.model.json.JSONModel();
				var p = e.getSource().getBindingContext(
					"AssignmentDataModel").sPath;
				var c = this._oAssignDialog.getModel(
					"AssignmentDataModel").getProperty(p);
				l.setData(c);
				// var P = this._Parameter;
				var P = this._D;
				// var P =
				// mrs.resourcemanagement.Util.Util.getCurrentUser();
				if (this.oEditAssignDialog) {
					this.oEditAssignDialog.destroy(true);
				}
				this.oEditAssignDialog = new sap.m.Dialog({
					showHeader: false,
					contentWidth: "1100px",
					contentHeight: "670px"
				});
				this.oEditAssignView = sap.ui
					.view({
						type: sap.ui.core.mvc.ViewType.XML,
						viewName: "mrs.resourcemanagement.view.assignment.TeamAssignmentEditDialog",
						width: "100%",
						height: "100%"
					});
				this.oEditAssignDialog.addContent(this.oEditAssignView);
				this.getView().addDependent(this.oEditAssignDialog);
				if (l.getData().AssignmentType !== "O") {
					var m = new sap.ui.model.json.JSONModel();
					var r = l.getProperty("/RequestNumber");
					var R = l.getProperty("/RoleNumber");
					var C = l.getProperty("/ConsultantID");
					var s = "/CandidateSet(RequestNumber='" + r + "',RoleNumber='" + R + "',ConsultantID='" + C + "')";
					this.getView().getModel().read(
						s,
						null,
						null,
						false,
						function(d) {
							m.setData(d);
						},
						function(E) {
							mrs.resourcemanagement.Util.Util
								.showErrorMessage(E);
						});
					m.getData().PersonSet.FullName = P.FullName;
					this.oEditAssignDialog.getContent()[0].setModel(m,
						"CandidateModel");
				}
				this.oEditAssignView.getController().onEditAssignment(
					l.getProperty("/"));
				this.oEditAssignDialog.open();
				this._oAssignDialog.close();
			},
			defaultSepFormatter: function(v, a) {
				if (!v && !a) {
					return mrs.resourcemanagement.Util.Util
						.getResourceBundle().getText(
							"REQUEST_NO_VALUE");
				}
				if (v && !a) {
					return v;
				}
				if (!v && a) {
					return mrs.resourcemanagement.Util.Util
						.getResourceBundle().getText(
							"REQUEST_NO_VALUE") + " / " + a;
				}
				return v + " / " + a;
			},
			onExit: function() {
				this.unsubscribeToEvents();
				if (this.oEditAssignmenDialog) {
					this.oEditAssignmenDialog.destroy();
				}
				if (this.oAddAssignmentWizard) {
					this.oAddAssignmentWizard.destroy();
				}
				if (this.oShowDetailAssignment) {
					this.oShowDetailAssignment.destroy();
				}
				if (this.oDisplayDialog) {
					this.oDisplayDialog.destroy();
				}
				if (this.oEditAssignDialog) {
					this.oEditAssignDialog.destroy();
				}
				if (this._oAssignDialog) {
					this._oAssignDialog.destroy();
				}
			},
			generateUUID: function() {
				return mrs.resourcemanagement.control.calendar.util.Date
					.getInstance().uniqueTime() + "";
			},
			handleChange: function(e) {
				var f = e.getParameter("from");
				var t = e.getParameter("to");
				if (f && t) {
					this.calendar.setVisibleDateRange({
						startdate: f,
						enddate: t
					});
				}
			},
			loadAssignments: function() {

				if (!this.oCurrentStartDate) {
					this.oCurrentStartDate = new Date(new Date()
						.getFullYear(), 0, 1);
				}
				if (!this.oCurrentEndDate) {
					this.oCurrentEndDate = new Date(new Date()
						.getFullYear(), 11, 31);
				}
				this.loadAssignmentsForDateRange(
					this.oCurrentStartDate, this.oCurrentEndDate);
			},

			loadAssignmentsForYear: function(c, e, d) {
				if (d.getFullYear() !== this.oCurrentStartDate
					.getFullYear()) {
					this.oCurrentStartDate = new Date(d.getFullYear(),
						0, 1);
					this.oCurrentEndDate = new Date(d.getFullYear(),
						11, 31);
				}
				this.loadAssignmentsForDateRange(
					this.oCurrentStartDate, this.oCurrentEndDate);
			},

			loadAssignmentsForDateRange: function(s, e) {
				// var c = "00000948";
				// = mrs.resourcemanagement.Util.Util.getCurrentUser();
				if (this._Parameter) {
					var p = "/PersonSet('" + this._Parameter + "')/AssignmentSet";
					var S = new sap.ui.model.Filter("StartDate",
						sap.ui.model.FilterOperator.EQ, s);
					var E = new sap.ui.model.Filter("EndDate",
						sap.ui.model.FilterOperator.EQ, e);
					var l = new Date(0).getTimezoneOffset();
					var L = new sap.ui.model.Filter("ClientTimeZone",
						sap.ui.model.FilterOperator.EQ, l);
					var d = this.getView().getModel();
					var that = this;
					// mrs.resourcemanagement.Util.Util.showBusyDialog();
					// if(this._check === 1)
					// {
					mrs.resourcemanagement.Util.Util.showBusyDialog();
					d
						.read(
							p, {
								success: jQuery
									.proxy(
										function(D) {
											var o = mrs.resourcemanagement.Util.DataPreparation
												.prepareAssignmentsForConsumption(D);
											mrs.resourcemanagement.Util.Util
												.hideBusyDialog();
											this._eModel
												.refresh(true);
											this._eModel
												.setData({
													data: o
												});
											sap.ui
												.getCore()
												.setModel(
													this._eModel,
													"globalModel");
											// this.getView().getModel("viewData").setProperty("/assign",
											// o);
											// this.getView().setModel(this._e
										}, this),
								error: jQuery
									.proxy(
										function(o) {
											mrs.resourcemanagement.Util.Util
												.hideBusyDialog();
											mrs.resourcemanagement.Util.Util
												.showErrorMessage(o);
										}, this),
								filters: [S, E, L]
							});
					// var sUrl = "/sap/opu/odata/sap/";
					// var oDModel = new
					// sap.ui.model.odata.v2.ODataModel(sUrl, true, {
					// "Content-Type": "application/json",
					// "X-Requested-With": "JSONHttpRequest",
					// "X-CSRF-TOKEN": this._csrfToken
					// });
					// var that = this;
					// oDModel.setUseBatch(false);
					// var path1 = "/PRScheduleRMAuthSet('" +
					// this._Parameter + "')";

					// oDModel.read(path1, {
					// async: true,

					// success: function(oData, response) {
					// if (response.statusCode === 200) {
					// // that._check = 1;
					// that._D = oData;

					// }
					// },
					// error: function(oError) {
					// sap.m.MessageToast.show("Could not retrieve data
					// form server!");
					// }
					// });
				}
				// }
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
					success: function(data, textStatus, request) {
						csrfToken = request
							.getResponseHeader('x-csrf-token');
						// var oView = that.getView();
						// oView.byId("smartTblTest").setEntitySet("ETS_PEOPLE_WORKLIST");

					}
				});
				return csrfToken;
			},
			// start: Changes by Hansapriya
			_handleEditOptSel: function(evt) {
				var editOptKey = evt.getSource().data("editOptKey");
				// start: Changes by Hansapriya
				switch (editOptKey) {
					case "start":
						{
							if (!this._DialogAssgStart) {
								this._DialogAssgStart = sap.ui
									.xmlfragment(
										"myFragAssgStart",
										"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.AssgStartDate",
										this);
								this.getView().addDependent(this._DialogAssgStart);
							}
						}
						break;
					case "end":
						{
							if (!this._DialogAssgStart) {
								this._DialogAssgStart = sap.ui
									.xmlfragment(
										"myFragAssgEnd",
										"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.ChangeAssgEndDt",
										this);
								this.getView().addDependent(this._DialogAssgStart);
							}
						}
						break;
					case "edit":
						{
							if (!this._DialogAssgStart) {
								this._DialogAssgStart = sap.ui
									.xmlfragment(
										"myFragAssgEdit",
										"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.EditAssgHrsView",
										this);
								this.getView().addDependent(this._DialogAssgStart);
							}
							//added by diwakar					
							this._DialogAssgStart.setContentWidth("300%");
							this._DialogAssgStart.setContentHeight("125%");
							//end
						}
						break;
					case "recreate":
						{
							if (!this._DialogAssgStart) {
								this._DialogAssgStart = sap.ui
									.xmlfragment(
										"myFragAssgRecreate",
										"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.RecreateAssgView",
										this);
								this.getView().addDependent(this._DialogAssgStart);
							}
						}
						break;
				}

				//this._DialogAssgStart.setModel(this.aEditMod, "aEditMod");

				this._DialogAssgStart.open();
				// end: Changes by Hansapriya
				// Diwakar Changes
				if (this._DialogAssgStart.mProperties.title === "Edit Assignment Hours") {
					var calHeader = sap.ui.core.Fragment.byId("myFragAssgEdit", "PC1")._oCalendarHeader.sId;
					$(jQuery.sap.domById(calHeader)).css("display", "none");
				}
				//end of Diwakar changes
				// if (!this.oEditAssignmenDialog) {
				// this.oEditAssignmenDialog = new sap.m.Dialog({
				// showHeader : false,
				// contentWidth : "80%",
				// contentHeight : "80%"
				// });
				// this.oEditAssignmenView = sap.ui
				// .view({
				// type : sap.ui.core.mvc.ViewType.XML,
				// viewName :
				// "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.ChangeAssgStartDtView",
				// width : "100%",
				// height : "100%"
				// });
				// this.oEditAssignmenDialog
				// .addContent(this.oEditAssignmenView);
				//							this.getView().addDependent(
				//									this.oEditAssignmenDialog);
				//						}
				// this.oEditAssignmenView.getController()
				// .onEditAssignment(
				// this.getView().getModel("details")
				// .getProperty("/"));
				//						this.oEditAssignmenDialog.open();
				// if (!this._selfregistrationView) {
				// this._selfregistrationView = sap.ui.xmlview(
				// "assgStartView",
				// "mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.ChangeAssgStartDtView"
				// );
				// }
				// this._selfregistrationView.byId("selfregistrationDialog").open();
			},
			_handleCancel: function() {
				var oAssignmentModel = this.getView().getModel("AssignmentModel");
				oAssignmentModel.setProperty("/vboxVisible", false);
				this._DialogAssgStart.close();

			},
			onClose: function() {
				this._DialogAssgStart = null;
				//	this._DialogAssgStart.destroy();
			},
			_handleNewAssignStDt: function(evt) {
				var odat = this.getView().getModel("AssignmentModel").getData();
				var detDat = this.getView().getModel("details").getData();
				var oAssignmentModel = this.getView().getModel("AssignmentModel");
				if (new Date(odat.StartDate) > new Date(detDat.EndDate)) {
					if (oAssignmentModel.getProperty("/vboxVisible")) {
						oAssignmentModel.setProperty("/vboxVisible", false);
					}
					if (!this.pressDialog) {
						this.pressDialog = new sap.m.Dialog({
							title: 'Assignment Recreation',
							content: new sap.m.Text({
								text: "Start Date cannot be after the end date"
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function() {
									this.pressDialog.close();
								}.bind(this)
							})
						});

						//to get access to the global model
						this.getView().addDependent(this.pressDialog);
					}

					this.pressDialog.open();

				} else if (new Date(detDat.StartDate) > new Date(odat.StartDate)) {

					oAssignmentModel.setProperty("/vboxVisible", true);
				}

			},
			// end: Changes by Hansapriya
			onEditAssignment: function(e) {
				// this._check1.oData = "1";
				// sap.ui.getCore().setModel(this._check1,
				// "check_model");

				// start: Changes by Hansapriya

				if (!this._DialogEdit) {
					this._DialogEdit = sap.ui
						.xmlfragment(
							"myFragEditPop",
							"mrs.resourcemanagement.ZMRS_SCHEDULE.view.myschedule.EditPopoverCust",
							this);
					this.getView().addDependent(this._DialogEdit);
				}
				this._DialogEdit.setModel(this.aEditMod, "aEditMod");

				this._DialogEdit.openBy(e.getSource());
				// end: Changes by Hansapriya

				// if (typeof (this.oShowDetailAssignment) ===
				// "undefined") {
				// this.oDisplayDialog.close();
				// } else {
				// this.oShowDetailAssignment.close();
				// }
				// if (!this.oEditAssignmenDialog) {
				// this.oEditAssignmenDialog = new sap.m.Dialog({
				// showHeader : false,
				// contentWidth : "80%",
				// contentHeight : "80%"
				// });
				// this.oEditAssignmenView = sap.ui
				// .view({
				// type : sap.ui.core.mvc.ViewType.XML,
				// viewName :
				// "mrs.resourcemanagement.view.assignment.TeamAssignmentEditDialog",
				// width : "100%",
				// height : "100%"
				// });
				// this.oEditAssignmenDialog
				// .addContent(this.oEditAssignmenView);
				// this.getView().addDependent(
				// this.oEditAssignmenDialog);
				// }
				// this.oEditAssignmenView.getController()
				// .onEditAssignment(
				// this.getView().getModel("details")
				// .getProperty("/"));
				// this.oEditAssignmenDialog.open();
			},
			isNotOtherBookingType: function(t) {
				return !(t === mrs.resourcemanagement.Util.Constants.AssignmentType.OTHER);
			},
			hasText: function(v) {
				return v ? true : false;
			},
			hasNoText: function(v) {
				return v ? false : true;
			}
		});