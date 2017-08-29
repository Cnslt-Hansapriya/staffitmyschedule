/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
jQuery.sap.require("mrs.resourcemanagement.control.calendar.model.EventModel");
jQuery.sap.require("mrs.resourcemanagement.control.calendar.Calendar");
jQuery.sap.require("mrs.resourcemanagement.control.HeaderData");
jQuery.sap.require("mrs.resourcemanagement.model.MockAssignmentModel");
jQuery.sap.require("mrs.resourcemanagement.control.MonthlyCalendar");
sap.ui.controller("mrs.resourcemanagement.view.assignment.CandidateAssignmentEditDialog", {
	bAddAssignmentMode: true,
	onInit: function() {
		this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle();
		this._eModel = new sap.ui.model.json.JSONModel()
		
	},
	onExit: function() {
		sap.ui.getCore().getEventBus().unsubscribe(mrs.resourcemanagement.Util.Constants.EventChannels.CALENDAR, mrs.resourcemanagement.Util.Constants
			.Events.YEAR_CHANGED, this.loadAssignmentsForYear, this)
	},
	onAfterRendering: function() {
		jQuery.sap.require("mrs.resourcemanagement.control.calendar.EventRenderer");
		var c = this.getView().byId("calendarLayout");
		var C;
		if (typeof(this.getView().getModel("AssignmentCreate")) !== "undefined") {
			C = new mrs.resourcemanagement.control.MonthlyCalendar({
				month: this.getView().getModel("AssignmentCreate").getData().StartDate.getMonth(),
				year: this.getView().getModel("AssignmentCreate").getData().StartDate.getFullYear(),
				model: this.getView().getModel("AssignmentCreate").getData()
			})
		} else {
			C = new mrs.resourcemanagement.control.MonthlyCalendar({
				month: new Date().getMonth(),
				year: new Date().getFullYear()
			})
		}
		C.setModel(this._eModel);
		C.bindAggregation("records", {
			path: "/data",
			length: 5000,
			factory: function() {
				return new mrs.resourcemanagement.control.calendar.model.EventModel().bindProperty("StartDate", "StartDate").bindProperty(
					"EndDate", "EndDate").bindProperty("Id", "DemandKey").bindProperty("ResourceId", "ResourceKey").bindProperty("ColorCode",
					"ColorKey",
					function(v) {
						return (/^#/.test(v) ? v : "#" + v)
					}).bindProperty("Duration", "Duration", function(v) {
					return parseFloat(v)
				}).bindProperty("DurationUnit", "DurationUnit").bindProperty("AssignmentPrefix", "SettlementType").bindProperty("IsHardbooked",
					"BookingType",
					function(v) {
						return v === mrs.resourcemanagement.Util.Constants.BookingTypeKey.HARDBOOKED
					}).bindProperty("IsSoftbooked", "BookingType", function(v) {
					return v === mrs.resourcemanagement.Util.Constants.BookingTypeKey.SOFTBOOKED
				}).bindProperty("SubText", "AssignmentTypeDesc").bindProperty("Text", "LocalClientName").bindProperty("Editable",
					"IsEditable")
			}
		});
		C.attachEvent("select", jQuery.proxy(function(d) {
			var l = new sap.ui.model.json.JSONModel();
			var s = d.getParameters().record;
			var i = s.getBindingContext().getObject();
			l.setData(i);
			this.getView().setModel(l, "AssignmentModel");
			this.getView().byId("assignmentDetailsTab").setEnabled(true);
			var t = this.getView().byId("assignmentDetailsTabBarId");
			this.getView().byId("calendarLayout").addStyleClass("hideControl");
			this.getView().byId("assignmentDetailsVBox").removeStyleClass("hideControl");
			t.setSelectedKey(t.getItems()[0].getId());
			if (i.BookingType === "5" || !((this.getAddAssignmentMode()) && (this.getView().getModel("AssignmentModel").getData().IsEditable))) {
				this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(false)
			} else {
				this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(true)
			}
		}, this));
		C.attachEvent("display", jQuery.proxy(function(d) {
			var l = new sap.ui.model.json.JSONModel();
			var I = [];
			var T = 0;
			var s = d.getParameters().record;
			var b;
			if (typeof(this.getView().getParent().getModel("PersonModel")) === "undefined") {
				b = this.getView().getParent().getModel("CandidateModel").getData().PersonSet.FullName
			} else {
				b = this.getView().getParent().getModel("PersonModel").getData().FullName
			}
			for (var i = 0; i < s.length; i++) {
				var e = s[i].record.getBindingContext();
				e.oModel.getProperty(e.sPath).duration = s[i].duration + e.oModel.getProperty(e.sPath).DurationUnit;
				T = T + parseFloat(s[i].duration);
				I.push(e.oModel.getProperty(e.sPath))
			}
			I.TotalHours = T.toFixed(2).toString() + " " + s[0].record.getBindingContext().oModel.getProperty(s[0].record.getBindingContext().sPath)
				.DurationUnit;
			I.element = d.getParameters().element;
			l.setData(I);
			this.getView().setModel(l, "AssignmentDisplayModel");
			sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
				.Constants.Events.SHOW_ASSIGNMENT_FOR_CANDIDATE, {
					"assignment": l,
					"candidateName": b
				})
		}, this));
		C.attachEvent("add", jQuery.proxy(function(d) {
			var b = this.getView().getModel("CandidateModel");
			var s = d.getParameters().startDate;
			sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
				.Constants.Events.CREATE_ASSIGNMENT_FOR_CANDIDATE, {
					"candidate": b,
					"selectedDate": s
				});
			this.onCloseDialog()
		}, this));
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("mrs.resourcemanagement", "/resource/css/monthlyCalendar.css"), null, jQuery.proxy(
			function() {
				if (!this.getAddAssignmentMode()) {
					C.setAllowAdding(false)
				}
				c.addContent(C)
			}, this));
		sap.ui.getCore().getEventBus().subscribe(mrs.resourcemanagement.Util.Constants.EventChannels.CALENDAR, mrs.resourcemanagement.Util.Constants
			.Events.YEAR_CHANGED, this.loadAssignmentsForYear, this);
		var t = this.getView().byId("assignmentDetailsTabBarId");
		if (this._sDefaultTab === mrs.resourcemanagement.Util.Constants.AssignmentDetailsTab.Details) {
			this.getView().byId("calendarLayout").addStyleClass("hideControl");
			this.getView().byId("assignmentDetailsVBox").removeStyleClass("hideControl");
			t.setSelectedKey(t.getItems()[0].getId());
			this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(true)
		} else {
			this.getView().byId("calendarLayout").removeStyleClass("hideControl");
			this.getView().byId("assignmentDetailsVBox").addStyleClass("hideControl");
			this.getView().byId("assignmentDetailsTab").setEnabled(false);
			t.setSelectedKey(t.getItems()[1].getId());
			this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(false)
		}
		var o = this.getView().byId("calendarLayout");
		var a = o.getContent()[0];
		if (a) {
			a._goToDate(new Date())
		}
		this.loadAssignments()
	},
	onCloseDialog: function() {
		this.getView().getParent().close();
		this.getView().getParent().destroy(true)
	},
	onTabBarSelected: function(e) {
		if (e.getSource().getSelectedKey() === e.getSource().getItems()[0].getId()) {
			this.getView().byId("calendarLayout").addStyleClass("hideControl");
			this.getView().byId("assignmentDetailsVBox").removeStyleClass("hideControl");
			this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(true)
		} else if (e.getSource().getSelectedKey() === e.getSource().getItems()[1].getId()) {
			this.getView().byId("calendarLayout").removeStyleClass("hideControl");
			this.getView().byId("assignmentDetailsVBox").addStyleClass("hideControl");
			this.getView().byId("candidateAssignmentDetailEditBtn").setEnabled(false)
		}
	},
	setDefaultTab: function(t) {
		this._sDefaultTab = t
	},
	loadAssignments: function() {
		if (!this.oCurrentStartDate) {
			this.oCurrentStartDate = new Date(new Date().getFullYear(), 0, 1)
		}
		if (!this.oCurrentEndDate) {
			this.oCurrentEndDate = new Date(new Date().getFullYear(), 11, 31)
		}
		this.loadAssignmentsForDateRange(this.oCurrentStartDate, this.oCurrentEndDate)
	},
	loadAssignmentsForYear: function(c, e, d) {
		if (d.getFullYear() !== this.oCurrentStartDate.getFullYear()) {
			this.oCurrentStartDate = new Date(d.getFullYear(), 0, 1);
			this.oCurrentEndDate = new Date(d.getFullYear(), 11, 31)
		}
		this.loadAssignmentsForDateRange(this.oCurrentStartDate, this.oCurrentEndDate)
	},
	loadAssignmentsForDateRange: function(s, e) {
		var c = this.getView().getModel("CandidateModel");
		var p = this.getView().getModel("PersonModel");
		if (this.getView().getModel("AssignmentModel")) {
			s = new Date(this.getView().getModel("AssignmentModel").getData().StartDate.getFullYear(), 0, 1);
			e = new Date(this.getView().getModel("AssignmentModel").getData().EndDate.getFullYear(), 11, 31)
		}
		s = mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(s);
		e = mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(e);
		var P = "";
		if (c) {
			P = c.getData().ConsultantID
		} else if (p) {
			P = p.getData().Pernr
		}
		if (P) {
			var a = "/PersonSet('" + P + "')/AssignmentSet";
			var r = this.getView().getModel("EditModel").getProperty("/");
			var S = new sap.ui.model.Filter("StartDate", sap.ui.model.FilterOperator.EQ, s);
			var E = new sap.ui.model.Filter("EndDate", sap.ui.model.FilterOperator.EQ, e);
			var l = new Date(0).getTimezoneOffset();
			var L = new sap.ui.model.Filter("ClientTimeZone", sap.ui.model.FilterOperator.EQ, l);
			var R = new sap.ui.model.Filter("RequestNumber", sap.ui.model.FilterOperator.EQ, r.RequestNumber);
			var o = new sap.ui.model.Filter("RoleNumber", sap.ui.model.FilterOperator.EQ, r.RoleNumber);
			var b = new sap.ui.model.Filter("RoleEndDate", sap.ui.model.FilterOperator.EQ, mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(
				r.RoleEndDate));
			var d = new sap.ui.model.Filter("RoleStartDate", sap.ui.model.FilterOperator.EQ, mrs.resourcemanagement.Util.DataPreparation.changeDateToUTC(
				r.RoleStartDate));
			var f = new sap.ui.model.Filter("SPGroup", sap.ui.model.FilterOperator.EQ, r.SPGroup);
			var h = new sap.ui.model.Filter("HasTimeRule", sap.ui.model.FilterOperator.EQ, r.HasTimerule);
			var g = new sap.ui.model.Filter("RequestedDays", sap.ui.model.FilterOperator.EQ, r.RequestedDays);
			var i = new sap.ui.model.Filter("SpGuid", sap.ui.model.FilterOperator.EQ, r.SpGuid);
			var D = this.getView().getModel();
			mrs.resourcemanagement.Util.Util.showBusyDialog();
			D.read(a, {
				success: jQuery.proxy(function(j) {
					var k = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentsForConsumption(j);
					mrs.resourcemanagement.Util.Util.hideBusyDialog();
					this._eModel.setData({
						data: k
					})
				}, this),
				error: jQuery.proxy(function(j) {
					mrs.resourcemanagement.Util.Util.hideBusyDialog();
					mrs.resourcemanagement.Util.Util.showErrorMessage(j)
				}, this),
				filters: [S, E, L, R, o, b, d, f, h, i, g]
			})
		}
	},
	setAddAssignmentMode: function(m) {
		this.bAddAssignmentMode = m
	},
	getAddAssignmentMode: function() {
		return this.bAddAssignmentMode
	},
	onEditDialog: function() {
		this.onCloseDialog();
		if (!this.oEditAssignmenDialog) {
			this.oEditAssignmenDialog = new sap.m.Dialog({
				showHeader: false,
				contentWidth: "1100px",
				contentHeight: "670px"
			});
			this.oEditAssignmenView = sap.ui.view({
				type: sap.ui.core.mvc.ViewType.XML,
				viewName: "mrs.resourcemanagement.view.assignment.TeamAssignmentEditDialog",
				width: "100%",
				height: "100%"
			});
			this.oEditAssignmenDialog.addContent(this.oEditAssignmenView);
			this.getView().addDependent(this.oEditAssignmenDialog)
		}
		this.oEditAssignmenView.getController().onEditAssignment(this.getView().getModel("AssignmentModel").getProperty("/"));
		this.oEditAssignmenDialog.open()
	},
	isNotOtherBookingType: function(t) {
		return !(t === mrs.resourcemanagement.Util.Constants.AssignmentType.OTHER)
	},
	isOtherBookingType: function(t) {
		return (t === mrs.resourcemanagement.Util.Constants.AssignmentType.OTHER)
	},
	fourByTenIndicatorFormatter: function(v) {
		if (v) {
			return 0
		}
		return 1
	},
	nameNumberFormatter: function(n, a, e) {
		if (!n && !a) {
			return e
		} else {
			return a + " / " + n
		}
	}
});