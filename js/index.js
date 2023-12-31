"use strict";

const tipCalculator = (function () {
  // Cache Dom
  const $form = document.querySelector(".form");
  const $formGroups = document.querySelectorAll(".form__group");
  const $bill = document.getElementById("bill");
  const $numOfPeople = document.getElementById("people");
  const $tipContainer = document.querySelector(".tip-container");
  const $tipAmount = document.getElementById("tip");
  const $tipCustom = document.querySelector("input[name='custom-tip']");
  const $totalAmount = document.getElementById("total");
  const $btnReset = document.getElementById("reset");

  const tip = {};

  tip.formSubmit = function (e) {
    e.preventDefault();
    this.removeErrorMessage();

    if (this.checkValidation()) {
      this.displayResultValue();

      document.activeElement.blur();
    }
  };

  tip.formTypeNumber = function (e) {
    const allowKeys =
    [..."0123456789.", "Backspace", "Enter", "Tab", "ArrowRight", "ArrowLeft"];

    if (e.target.tagName === "INPUT" && e.target.type === "number") {
      if (!allowKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  tip.calcTipPerPerson = function (bill, tipRate, people) {
    return (bill * (tipRate / 100)) / people;
  };

  tip.calcTotalPerPerson = function (bill, tip, people) {
    return bill / people + tip;
  };

  tip.displayResultValue = function () {
    const bill = +$bill.value;
    const people = +$numOfPeople.value;
    const tipRate = this.getTipRate();

    const tip = this.calcTipPerPerson(bill, tipRate, people);
    const total = this.calcTotalPerPerson(bill, tip, people);

    $tipAmount.value = `$${tip.toFixed(2)}`;
    $totalAmount.value = `$${total.toFixed(2)}`;

    // turn on reset button
    $btnReset.removeAttribute("disabled");
  };

  tip.checkValidation = function () {
    if ($bill.value < 1) {
      $bill.setCustomValidity("Can't be zero");
      return $bill.checkValidity();
    }

    if ($numOfPeople.value < 1) {
      $numOfPeople.setCustomValidity("Can't be zero");
      return $numOfPeople.checkValidity();
    }

    return true;
  };

  tip.showErrorMessage = function (e) {
    const formGroup = e.target.closest(".form__group");
    const errorBox = formGroup.querySelector(".error-message");

    formGroup.classList.add("form__group--error");
    errorBox.textContent = e.target.validationMessage;
  };

  tip.removeErrorMessage = function () {
    $formGroups.forEach((element) => {
      element.classList.remove("form__group--error");
    });
  };

  // tip select function
  tip.selectTip = function (e) {
    if (/^tip-/.test(e.target.name)) {
      this.unselectTip(e.target);
      $tipCustom.value &&= "";
      e.target.classList.toggle("select");
    }
  };

  // unselect selected tip function
  tip.unselectTip = function (target) {
    const tipElement = $tipContainer.querySelector(".select");
    if (target === tipElement) return;

    tipElement?.classList.remove("select");
  };

  tip.inputCustomTip = function (e) {
    const customTip = +e.target.value;
    if (customTip) {
      this.unselectTip();
    }
  };

  tip.getTipRate = function () {
    let tip = $tipContainer.querySelector(".select")?.value;
    tip ||= $tipCustom.value || 0;

    return parseInt(tip);
  };

  tip.reset = function () {
    $bill.value = "";
    $numOfPeople.value = "";
    $tipAmount.value = "$0.00";
    $totalAmount.value = "$0.00";
    $btnReset.setAttribute("disabled", "");
  };

  tip.init = function () {
    tip.reset();

    $form.addEventListener("keydown", this.formTypeNumber);
    $form.addEventListener("submit", this.formSubmit.bind(this));
    $tipCustom.addEventListener("change", this.inputCustomTip.bind(this));
    $btnReset.addEventListener("click", this.reset.bind(this));
    $tipContainer.addEventListener("click", this.selectTip.bind(this));
    $bill.addEventListener("invalid", this.showErrorMessage);
    $numOfPeople.addEventListener("invalid", this.showErrorMessage);
  };

  return tip;
})();

// Initialize tip calculator
document.addEventListener(
  "DOMContentLoaded",
  tipCalculator.init.bind(tipCalculator)
);
