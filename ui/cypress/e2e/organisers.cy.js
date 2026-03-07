import OrganisersPageClass from "../pages/organisers.page";
import { USER_ROLES } from "../../src/lib/constants.mjs";
import { stubRegisterEvent } from "../support/stubs";

describe("Organisers", () => {
  const organisersPage = new OrganisersPageClass();

  beforeEach(() => {
    cy.interceptAmplifyAuth();
    cy.stubAPI();
    cy.stubUser(USER_ROLES.ORGANISER);

    organisersPage.open();
  });

  describe("Event registration", () => {
    it("Should be able to submit an event", () => {
      stubRegisterEvent({ event: { statusCode: 201, body: "Event created" } });

      organisersPage
        .fillInRegisterEventForm({
          startDate: "2026-03-07T12:00",
          endDate: "2026-03-09T12:00",
          requiredWalkers: "200",
          requiredVolunteers: "10",
          earlyBirdPrice: "40",
          earlyBirdCutoff: "2026-03-05T12:00",
          price: "50",
        })
        .submitRegisterEventForm()
        .verifyToast("Event registered successfully");
    });

    it("Should be able to handle errors", () => {
      stubRegisterEvent({ overrides: { errors: { statusCode: 400, message: "invalid request", times: 1 } } });

      organisersPage
        .fillInRegisterEventForm({
          startDate: "2026-03-07T12:00",
          endDate: "2026-03-09T12:00",
          requiredWalkers: "200",
          requiredVolunteers: "10",
          earlyBirdPrice: "40",
          earlyBirdCutoff: "2026-03-05T12:00",
          price: "50",
        })
        .submitRegisterEventForm()
        .verifyToast("Failed to register event.");
    });

    it("Should be able to validate data", () => {
      organisersPage
        .fillInRegisterEventForm({
          startDate: "2026-03-07T12:00",
          endDate: "2026-03-05T12:00",
          requiredWalkers: "-200.01",
          requiredVolunteers: "-10.7",
          earlyBirdPrice: "-40.40",
          earlyBirdCutoff: "2026-03-09T12:00",
          price: "-50.99",
        })
        .submitRegisterEventForm()
        .verifyFormError("End date must be after start date.", 0)
        .verifyFormError("required Walkers must be a positive whole number.", 1)
        .verifyFormError("required Volunteers must be a positive whole number.", 2)
        .verifyFormError("early Bird Price must be a positive whole number.", 3)
        .verifyFormError("price must be a positive whole number.", 4);
    });
  });
});
