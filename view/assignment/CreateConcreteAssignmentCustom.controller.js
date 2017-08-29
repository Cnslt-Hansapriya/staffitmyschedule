/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("mrs.resourcemanagement.Util.Constants");
jQuery.sap.require("mrs.resourcemanagement.Util.Util");
jQuery.sap.require("mrs.resourcemanagement.Util.RoleBusinessRules");
jQuery.sap.require("mrs.resourcemanagement.Util.DataPreparation");
sap.ui.controller("mrs.resourcemanagement.ZMRS_SCHEDULE.view.assignment.CreateConcreteAssignmentCustom", {
	onInit: function() {
		this.getView().setModel(mrs.resourcemanagement.Util.Util.getWeekdaysModel(), "WeekdaysModel");
		this.getView().setModel(new sap.ui.model.json.JSONModel({
			"perHourSelected": true,
			"isDisabled": true,
			"isSelected": false,
			"oDate": true
		}), "AssignmentBusinessRules");
		this.resourceBundle = mrs.resourcemanagement.Util.Util.getResourceBundle()
	},
	onAfterRendering: function() {
		this.getView().getModel("AssignmentBusinessRules").getData().oDate = true;
		this.getView().byId("displayTimeRulesConcreteCheck").setSelected(this.getView().getModel("AssignmentModel").getData().HasTimeRule);
		if (this.getView().getModel("AssignmentModel").getData().HasTimeRule) {
			this.onConcreteCheckboxPress()
		}
		var i = this.getView().getModel("AssignmentModel").getProperty("/");
		var p = this.getView().getModel("CandidateModel").getProperty("/PersonSet");
		if (!i.NoofHoursPerDay) {
			this.getView().getModel("AssignmentModel").setProperty("/NoofHoursPerDay", p.DefaultDailyWorkingHours)
		}
		var h;
		if (p.DefaultDailyWorkingHours) {
			h = parseInt(p.DefaultDailyWorkingHours, 10);
			if (h === 0) {
				h = 8
			}
			this.byId("assignmentHoursPerDaySlider").setMax(h);
			this.byId("maxHoursLabel").setText("" + h)
		} else {
			h = parseInt(8, 10);
			this.byId("assignmentHoursPerDaySlider").setMax(h);
			this.byId("assignmentHoursPerDaySlider").setValue(h);
			this.byId("maxHoursLabel").setText("" + h)
		}
		if (i.Duration <= 0) {
			this.updateAssignDays()
		}
		this.getView().getModel("AssignmentModel").refresh(true)
	},
	invertStateFormatter: function(p, i) {
		if (i) {
			if (p) {
				this.getView().byId("weekdaysSelection").addStyleClass("weekSelectionDisabled")
			} else {
				this.getView().byId("weekdaysSelection").removeStyleClass("weekSelectionDisabled")
			}
			return !p
		} else {
			return i
		}
	},
	enablePerHour: function(p) {
		if (this.getView().getModel("AssignmentBusinessRules").getProperty("/isDisabled")) {
			return p
		} else {
			return this.getView().getModel("AssignmentBusinessRules").getProperty("/isDisabled")
		}
	},
	dateFormatter: function(d) {
		var D = sap.ui.core.format.DateFormat.getInstance({
			pattern: "dd/MM/yyyy"
		});
		return D.format(d)
	},
	onConcreteCheckboxPress: function() {
		var v = this.getView();
		var i = v.byId("displayTimeRulesConcreteCheck").getSelected();
		if (i) {
			v.byId("assignmentAssignedDaysBox").setVisible(false);
			this.updateAssignDays();
			if (v.byId("radioButtonPerHour").getSelected()) {
				v.getModel("AssignmentBusinessRules").setProperty("/isSelected", true)
			} else {
				v.getModel("AssignmentBusinessRules").setProperty("/isSelected", false)
			}
		} else {
			v.byId("assignmentAssignedDaysBox").setVisible(true);
			v.byId("concreteStartEndDate").setValueState("None")
		}
		v.byId("assignmentAssignedDaysInput").setEnabled(!i);
		v.byId("assignmentWeekdayRadioButton").setEnabled(!i);
		v.byId("radioButtonPerHour").setEnabled(!i);
		v.byId("assignmentHoursPerDayInput").setEnabled(!i);
		v.byId("assignmentHoursPerDaySlider").setEnabled(!i);
		v.getModel("AssignmentBusinessRules").setProperty("/isDisabled", !i);
		if (v.getModel("AssignmentBusinessRules").getProperty("/isSelected")) {
			v.byId("radioButtonPerHour").setSelected(true)
		} else {
			v.byId("assignmentWeekdayRadioButton").setSelected(true)
		}
	},
	handlePopoverPress: function() {
		var m = new sap.ui.model.json.JSONModel({
			"results": []
		});
		if (!this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("mrs.resourcemanagement.view.request.RequestDetailRoleSchedulingAssignment", this);
			this._oPopover.setModel(m, "oTimeRulesModel");
			this.getView().addDependent(this._oPopover);
			var e = this.getView().getModel("AssignmentModel");
			var r = e.getProperty("/RequestNumber");
			var R = e.getProperty("/RoleNumber");
			this.getView().getModel().read("/TimeruleSet", null, "$filter=RequestNumber eq '" + r + "' and RoleNumber eq '" + R + "'", false,
				function(d) {
					var t = mrs.resourcemanagement.Util.DataPreparation.prepareTimeruleForConsumption(d);
					m.setData(t)
				},
				function(E) {
					mrs.resourcemanagement.Util.Util.showErrorMessage(E)
				})
		}
		var a = this.getView().byId("displayTimeRules");
		jQuery.sap.delayedCall(0, this, function() {
			this._oPopover.openBy(a)
		})
	},
	stateFormatter: function(s) {
		var S = 0;
		switch (s) {
			case "":
				S = 0;
				break;
			case "/":
				S = 1;
				break;
			case "X":
				S = 2;
				break;
			default:
				S = 0
		}
		return S
	},
	_getStateValue: function(s) {
		var S = "";
		switch (s) {
			case 0:
				S = "";
				break;
			case 1:
				S = "/";
				break;
			case 2:
				S = "X";
				break;
			default:
				S = ""
		}
		return S
	},
	defaultSepFormatter: function(v, a) {
		if (!v && !a) {
			return mrs.resourcemanagement.Util.Util.getResourceBundle().getText("REQUEST_NO_VALUE")
		}
		if (v && !a) {
			return v
		}
		if (!v && a) {
			return mrs.resourcemanagement.Util.Util.getResourceBundle().getText("REQUEST_NO_VALUE") + " / " + a
		}
		return v + " / " + a
	},
	onFourByTenCheckBoxSelect: function(e) {
		var n = e.getParameter("selectedIndex");
		var i = this.getView().getModel("AssignmentModel").getProperty("/");
		i.FourByTenIndicator = (n === 0)
	},
	fourByTenIndicatorFormatter: function(v) {
		if (v) {
			return 0
		}
		return 1
	},
	updateAssignDays: function() {
		var s = this.getView().byId("concreteStartEndDate");
		var S = s.getDateValue();
		var e = s.getSecondDateValue();
		if (this.getView().byId("displayTimeRulesConcreteCheck").getSelected() && this.getView().byId("displayTimeRulesConcreteCheck").getVisible()) {
			var r;
			var R;
			if (typeof(this.getView().getModel("EditModel")) === "undefined") {
				var m = new sap.ui.model.json.JSONModel({
					"results": []
				});
				var E = this.getView().getModel("AssignmentModel");
				var a = E.getProperty("/RequestNumber");
				var b = E.getProperty("/RoleNumber");
				this.getView().getModel().read("/TimeruleSet", null, "$filter=RequestNumber eq '" + a + "' and RoleNumber eq '" + b + "'", false,
					function(f) {
						var t = mrs.resourcemanagement.Util.DataPreparation.prepareTimeruleForConsumption(f);
						m.setData(t)
					},
					function(f) {
						mrs.resourcemanagement.Util.Util.showErrorMessage(f)
					});
				this.getView().setModel(m, "oDateModel");
				var o = this.getView().getModel("oDateModel").getData().results;
				var d = o[0].ValFrom;
				var D = o[0].ValTo;
				for (var i = 1; i < o.length; i++) {
					if (d > o[i].ValFrom) {
						d = o[i].ValFrom
					}
					if (D < o[i].ValTo) {
						D = o[i].ValTo
					}
				}
				this.getView().getModel("AssignmentModel").setProperty("/RoleStartDate", d);
				this.getView().getModel("AssignmentModel").setProperty("/RoleEndDate", D);
				r = this.getView().getModel("AssignmentModel").getData().RoleStartDate;
				R = this.getView().getModel("AssignmentModel").getData().RoleEndDate
			} else {
				r = this.getView().getParent().getParent().getParent().getParent().getParent().getModel("EditModel").getData().RoleStartDate;
				R = this.getView().getParent().getParent().getParent().getParent().getParent().getModel("EditModel").getData().RoleEndDate
			}
			if (S - r < 0 || e - R > 0) {
				s.setValueState("Error");
				this.getView().getModel("AssignmentBusinessRules").getData().oDate = false
			} else {
				s.setValueState("None");
				this.getView().getModel("AssignmentBusinessRules").getData().oDate = true
			}
		} else {
			s.setValueState("None");
			this.getView().getModel("AssignmentBusinessRules").getData().oDate = true
		}
		var A = 0;
		var c = this.getView().getModel("AssignmentModel").getProperty("/DurationUnit");
		if (this.getView().getModel("AssignmentBusinessRules").getProperty("/").perHourSelected) {
			A = mrs.resourcemanagement.Util.Util.calculateTotalDaysByHoursConcreteAssignment(S, e, this.getView().getModel("AssignmentModel").getProperty(
				"/NoofHoursPerDay"), c)
		} else {
			A = mrs.resourcemanagement.Util.Util.calculateTotalDaysByDaysConcreteAssignment(S, e, this.getView().getModel("AssignmentModel").getProperty(
				"/"), c)
		}
		this.getView().getModel("AssignmentModel").setProperty("/Duration", "" + A)
	},
	onMondayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Monday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onTuesdayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Tuesday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onWednesdayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Wednesday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onThursdayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Thursday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onFridayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Friday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onSaturdayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Saturday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onSundayPressed: function(e) {
		var s = e.getSource();
		this.getView().getModel("AssignmentModel").setProperty("/Weekday_Sunday", this._getStateValue(s.getState()));
		this.updateAssignDays()
	},
	onHoursPerDayChange: function(e) {
		var n = e.getSource().getValue();
		var a = this.byId("assignmentHoursPerDaySlider").getMax();
		if (parseInt(n, 10) < 0) {
			n = "0"
		}
		if (parseInt(n, 10) > a) {
			n = "" + a
		}
		this.getView().getModel("AssignmentModel").setProperty("/NoofHoursPerDay", n);
		this.updateAssignDays()
	},
	onAssignmentRadioButtonSelect: function(e) {
		var v = this.getView();
		if (e.getSource().getId().indexOf("PerHour") > 0 && e.getParameters().selected) {
			v.getModel("AssignmentBusinessRules").setProperty("/perHourSelected", true)
		} else {
			v.getModel("AssignmentBusinessRules").setProperty("/perHourSelected", false)
		}
		if (typeof(v.getModel("AssignmentModel")) !== "undefined") {
			v.getModel("AssignmentModel").refresh();
			this.updateAssignDays()
		}
	},
	_getRequiredInputfields: function() {
		return [this.getView().byId("assignmentAssignedDaysInput"), this.getView().byId("assignmentStartDate"), this.getView().byId(
			"assignmentEndDate")]
	},
	resetValidateStateInput: function() {
		var m = this;
		jQuery.each([m.byId("assignmentAssignedDaysInput"), m.byId("concreteStartEndDate")], function(i, a) {
			a.setValueState("None")
		});
		var I = this.getView().getModel("AssignmentModel").getProperty("/");
		var p = this.getView().getModel("CandidateModel").getProperty("/PersonSet");
		if (!I.NoofHoursPerDay && p) {
			this.getView().getModel("AssignmentModel").setProperty("/NoofHoursPerDay", p.DefaultDailyWorkingHours)
		}
		this.getView().getModel("AssignmentModel").refresh(true)
	},
	isValidateAssignmentInput: function() {
		var t = this;
		return mrs.resourcemanagement.Util.Util.validateForm(function() {
			return [t.byId("assignmentAssignedDaysInput"), t.byId("concreteStartEndDate")]
		}, function() {
			return []
		})
	},
	isValidateAssignedDays: function() {
		var t = this;
		return mrs.resourcemanagement.Util.Util.validateAssignedDays(t.getView().byId("assignmentAssignedDaysInput"))
	},
	isValidateDate: function() {
		var t = this;
		if (this.getView().byId("displayTimeRulesConcreteCheck").getSelected() && this.getView().byId("displayTimeRulesConcreteCheck").getVisible()) {
			if (!t.getView().getModel("AssignmentBusinessRules").getData().oDate) {
				t.getView().byId("concreteStartEndDate").setValueState("Error");
				return false
			} else {
				return true
			}
		} else {
			return true
		}
	},
	createAssignment: function() {
		if (this.isValidateAssignmentInput() && this.isValidateAssignedDays() && this.isValidateDate()) {
			var d = this.getView().getModel();
			var n = mrs.resourcemanagement.Util.DataPreparation.prepareAssignmentForSaving(this.getView().getModel("AssignmentModel").getProperty(
				"/"));
			n.AssignmentType = mrs.resourcemanagement.Util.Constants.AssignmentType.CONCRETE;
			n.IsTimeRuleActive = this.getView().byId("displayTimeRulesConcreteCheck").getSelected();
			var l = new Date(0).getTimezoneOffset();
			n.ClientTimeZone = l.toString();
			if (this.getView().getModel("AssignmentBusinessRules").getProperty("/").perHourSelected) {
				delete n.Weekday_Monday;
				delete n.Weekday_Tuesday;
				delete n.Weekday_Wednesday;
				delete n.Weekday_Thursday;
				delete n.Weekday_Friday;
				delete n.Weekday_Saturday;
				delete n.Weekday_Sunday
			} else {
				delete n.NoofHoursPerDay
			}
			d.create("/AssignmentSet", n, {
				success: jQuery.proxy(function(D) {
					mrs.resourcemanagement.Util.Util.hideBusyDialog();
					sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ASSIGNMENT_SAVE_SUCCESS"), {
						closeOnBrowserNavigation: false
					});
					sap.ui.getCore().getEventBus().publish(mrs.resourcemanagement.Util.Constants.EventChannels.ASSIGNMENT, mrs.resourcemanagement.Util
						.Constants.Events.ASSIGNMENT_SAVED, D);
					this.getView().getParent().getParent().getParent().getParent().close()
				}, this),
				error: jQuery.proxy(function(e) {
					mrs.resourcemanagement.Util.Util.hideBusyDialog();
					mrs.resourcemanagement.Util.Util.showErrorMessage(e)
				}, this)
			})
		}
	}
});