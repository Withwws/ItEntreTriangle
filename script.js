/**
 * Project: Triangle Classifier
 * Based on: Design Document: Triangle classifier
 */

/*
 * ======================================================================================
 * Module Name: TriangleMain
 * Reference: Design Document Page 2
 * --------------------------------------------------------------------------------------
 * Description: ฟังก์ชันหลัก รับ Input -> เรียกย่อย -> แสดงผล
 * 
 * Each validation step is delegated to specialized functions for clarity.
 * Input is validated early to avoid nested logic, and UI updates are handled
 * separately in ShowResult() for better separation of concerns.
 * ======================================================================================
 */

/**
 * Main entry point for triangle classification
 * Orchestrates the validation and classification workflow
 * @returns {void}
 */
function TriangleMain() {
  // Get input values from the form
  let s1 = document.getElementById("side1").value;
  let s2 = document.getElementById("side2").value;
  let s3 = document.getElementById("side3").value;

  // Step 1: Validate input format and values early
  let checkResult = NumberCheck(s1, s2, s3);

  if (checkResult.isValid) {
    // Convert strings to numbers only after validation passes
    let a = parseFloat(s1);
    let b = parseFloat(s2);
    let c = parseFloat(s3);

    // Step 2: Check triangle inequality theorem
    let isValidTriangle = TriangleValidation(a, b, c);

    if (isValidTriangle) {
      // Step 3 & 4: Detection & Classification
      let isRightTriangle = RightTriangleDetection(a, b, c);
      let triangleType = TriangleClassification(a, b, c);

      // Step 5: ShowResult (Success)
      ShowResult({
        status: "success",
        type: triangleType,
        isRight: isRightTriangle,
      });
    } else {
      // Error: Invalid Triangle Geometry
      ShowResult({
        status: "error",
        message:
          "Invalid Geometry: The sum of any two sides must be greater than the third side.",
      });
    }
  } else {
    // Error: Invalid Input Format
    ShowResult({
      status: "error",
      message: checkResult.message,
    });
  }
}

/*
 * ======================================================================================
 * Module Name: NumberCheck
 * Reference: Design Document Page 4
 * --------------------------------------------------------------------------------------
 * Validates that all inputs are valid positive numbers.
 * Checks for NaN, empty strings, and invalid ranges.
 * Always returns an object with isValid flag for consistent error handling.
 * ======================================================================================
 */

/**
 * Validates that all inputs are valid positive numbers
 * @param {string} in1 - First side length as string
 * @param {string} in2 - Second side length as string
 * @param {string} in3 - Third side length as string
 * @returns {{isValid: boolean, message?: string}} Validation result object
 */
function NumberCheck(in1, in2, in3) {
  // Check for NaN and empty strings before attempting conversion
  if (
    isNaN(in1) ||
    isNaN(in2) ||
    isNaN(in3) ||
    in1.trim() === "" ||
    in2.trim() === "" ||
    in3.trim() === ""
  ) {
    return {
      isValid: false,
      message: "Input Error: All fields must be numbers.",
    };
  }
  
  // Convert to numbers after validation
  let n1 = parseFloat(in1);
  let n2 = parseFloat(in2);
  let n3 = parseFloat(in3);

  // Validate that all values are positive (triangle sides must be > 0)
  if (n1 <= 0 || n2 <= 0 || n3 <= 0) {
    return {
      isValid: false,
      message: "Input Error: Values must be greater than 0.",
    };
  }
  
  return { isValid: true };
}

/*
 * ======================================================================================
 * Module Name: TriangleValidation
 * Reference: Design Document Page 5
 * --------------------------------------------------------------------------------------
 * Validates if three sides can form a valid triangle using Triangle Inequality Theorem.
 * The sum of any two sides must be greater than the third side.
 * All three conditions must be satisfied.
 * ======================================================================================
 */

/**
 * Validates if three sides can form a valid triangle using Triangle Inequality Theorem
 * The sum of any two sides must be greater than the third side
 * @param {number} a - First side length
 * @param {number} b - Second side length
 * @param {number} c - Third side length
 * @returns {boolean} True if sides can form a valid triangle
 */
function TriangleValidation(a, b, c) {
  // Triangle Inequality Theorem - all three conditions must be satisfied:
  // a + b > c, a + c > b, and b + c > a
  return a + b > c && a + c > b && b + c > a;
}

/*
 * ======================================================================================
 * Module Name: RightTriangleDetection
 * Reference: Design Document Page 6
 * --------------------------------------------------------------------------------------
 * Detects if a triangle is right-angled using the Pythagorean theorem (a² + b² = c²).
 * Uses epsilon tolerance for safe floating-point comparison to handle rounding errors.
 * Sides are sorted to correctly identify the hypotenuse (longest side).
 * ======================================================================================
 */

/**
 * Detects if a triangle is right-angled using the Pythagorean theorem
 * @param {number} a - First side length
 * @param {number} b - Second side length
 * @param {number} c - Third side length
 * @returns {boolean} True if triangle has a right angle (90°)
 */
function RightTriangleDetection(a, b, c) {
  // Sort sides to identify hypotenuse (longest side)
  let sides = [a, b, c].sort((x, y) => x - y);
  
  // Use epsilon tolerance for floating-point comparison
  const epsilon = 0.00001;
  
  // Check Pythagorean theorem: hypotenuse² = leg₁² + leg₂²
  return Math.abs(sides[2] ** 2 - (sides[0] ** 2 + sides[1] ** 2)) < epsilon;
}

/*
 * ======================================================================================
 * Module Name: TriangleClassification
 * Reference: Design Document Page 7
 * --------------------------------------------------------------------------------------
 * Classifies triangle based on side length relationships.
 * Checks from most specific case (equilateral) to least specific (scalene).
 * Covers all three triangle types: Equilateral, Isosceles, and Scalene.
 * ======================================================================================
 */

/**
 * Classifies triangle based on side length relationships
 * @param {number} a - First side length
 * @param {number} b - Second side length
 * @param {number} c - Third side length
 * @returns {string} Triangle classification: "Equilateral", "Isosceles", or "Scalene"
 */
function TriangleClassification(a, b, c) {
  // All three sides equal = Equilateral
  if (a === b && b === c) return "Equilateral Triangle";
  
  // At least two sides equal = Isosceles
  else if (a === b || a === c || b === c) return "Isosceles Triangle";
  
  // All sides different = Scalene
  else return "Scalene Triangle";
}

/*
 * ======================================================================================
 * Module Name: ShowResult
 * Reference: Design Document Page 8
 * --------------------------------------------------------------------------------------
 * Description: Handles all UI updates and result presentation
 * 
 * All UI logic is isolated in this function for better separation of concerns.
 * State is reset before applying new state to prevent visual artifacts.
 * Uses distinct visual states for success and error scenarios.
 * ======================================================================================
 */

/**
 * Updates the UI with triangle classification results or error messages
 * @param {{status: string, type?: string, isRight?: boolean, message?: string}} data - Result data object
 * @returns {void}
 */
function ShowResult(data) {
  // Cache all DOM element references
  const container = document.getElementById("result-container");
  const badge = document.getElementById("result-badge");
  const title = document.getElementById("triangle-type");
  const subtitle = document.getElementById("right-angle-status");
  const errorMsg = document.getElementById("error-msg");
  const img = document.getElementById("triangle-img");

  // Reset to clean state before applying new state
  container.classList.remove("hidden", "state-success", "state-error");
  title.style.display = "block";
  subtitle.style.display = "block";
  errorMsg.style.display = "none";
  img.style.display = "none";

  if (data.status === "error") {
    // --- ERROR STATE ---
    container.classList.add("state-error");
    badge.innerText = "Error";

    // Hide irrelevant UI elements in error state
    title.style.display = "none";
    subtitle.style.display = "none";

    // Show error message
    errorMsg.style.display = "block";
    errorMsg.innerText = data.message;
  } else {
    // --- SUCCESS STATE ---
    container.classList.add("state-success");
    badge.innerText = "Success";

    // 1. Display Triangle Classification
    title.innerText = data.type;

    // 2. Display Right Angle Status with Visual Feedback
    if (data.isRight) {
      subtitle.innerText = "This is a Right-Angled triangle.";
      subtitle.style.fontWeight = "600";
      subtitle.style.color = "#166534";
    } else {
      subtitle.innerText = "This is NOT a Right-Angled triangle.";
      subtitle.style.fontWeight = "400";
      subtitle.style.color = "#6b7280";
    }

    // 3. Select and Display Appropriate Triangle Image
    let imgUrl = "";
    // Right-angled triangles have priority over type classification
    if (data.isRight === true) {
      imgUrl =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Triangle.Right.svg/640px-Triangle.Right.svg.png";
    } else {
      // Map triangle types to their corresponding images
      switch (data.type) {
        case "Equilateral Triangle":
          imgUrl =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Triangle.Equilateral.svg/250px-Triangle.Equilateral.svg.png";
          break;
        case "Isosceles Triangle":
          imgUrl =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Triangle.Isosceles.svg/250px-Triangle.Isosceles.svg.png";
          break;
        case "Scalene Triangle":
          imgUrl =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Triangle.Scalene.svg/250px-Triangle.Scalene.svg.png";
          break;
      }
    }

    // Only update DOM if image URL exists
    if (imgUrl) {
      img.src = imgUrl;
      img.style.display = "block";
    }
  }
}

function TwoSideNumberCheck(in1, in2) {
  if (
    isNaN(in1) ||
    isNaN(in2) ||
    in1.trim() === "" ||
    in2.trim() === ""
  ) {
    return {
      isValid: false,
      message: "Input Error: Both side fields must be numbers.",
    };
  }

  let n1 = parseFloat(in1);
  let n2 = parseFloat(in2);

  if (n1 <= 0 || n2 <= 0) {
    return {
      isValid: false,
      message: "Input Error: Values must be greater than 0.",
    };
  }

  return { isValid: true };
}

function FormatSideValue(value) {
  return Number(value.toFixed(4)).toString();
}

function CalculateMissingSide() {
  const sideAInput = document.getElementById("calc-side-a").value;
  const sideBInput = document.getElementById("calc-side-b").value;
  const triangleType = document.getElementById("calc-type").value;

  const resultContainer = document.getElementById("missing-result");
  const resultMsg = document.getElementById("missing-msg");

  const checkResult = TwoSideNumberCheck(sideAInput, sideBInput);
  resultContainer.classList.remove("hidden", "state-success", "state-error");

  if (!checkResult.isValid) {
    resultContainer.classList.add("state-error");
    resultMsg.innerText = checkResult.message;
    return;
  }

  const a = parseFloat(sideAInput);
  const b = parseFloat(sideBInput);
  const epsilon = 0.00001;

  if (triangleType === "right") {
    const missing = Math.sqrt(a ** 2 + b ** 2);
    resultContainer.classList.add("state-success");
    resultMsg.innerText = `Missing side (hypotenuse) should be ${FormatSideValue(missing)}.`;
    return;
  }

  if (triangleType === "equilateral") {
    if (Math.abs(a - b) > epsilon) {
      resultContainer.classList.add("state-error");
      resultMsg.innerText = "For an equilateral triangle, the two given sides must be equal.";
      return;
    }

    resultContainer.classList.add("state-success");
    resultMsg.innerText = `Missing side should be ${FormatSideValue(a)}.`;
    return;
  }

  if (triangleType === "isosceles") {
    resultContainer.classList.add("state-success");

    if (Math.abs(a - b) <= epsilon) {
      resultMsg.innerText = `Missing side is not unique. It can be any value between 0 and ${FormatSideValue(2 * a)} except ${FormatSideValue(a)}.`;
      return;
    }

    resultMsg.innerText = `Missing side can be ${FormatSideValue(a)} or ${FormatSideValue(b)}.`;
    return;
  }

  resultContainer.classList.add("state-error");
  resultMsg.innerText = "Please choose a valid triangle type.";
}
