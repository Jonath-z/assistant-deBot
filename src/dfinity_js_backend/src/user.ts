import { update, text, Ok, Err, Result, StableBTreeMap, query } from "azle";
import { ErrorResponse } from "./models/error";

const usernameStorage = StableBTreeMap(text, text, 3);

class User {
  updateUsername() {
    return update(
      [text, text],
      Result(text, ErrorResponse),
      async (userIdentity, username) => {
        if (!userIdentity || !username) {
          return Err({
            error: { message: "userIdentity and username can not be empty" },
          });
        }

        usernameStorage.insert(userIdentity, username);
        return Ok(username);
      }
    );
  }

  getUsername() {
    return query([text], Result(text, ErrorResponse), async (userIdentity) => {
      const username = usernameStorage.get(userIdentity);
      if ("None" in username) {
        return Err({
          error: { message: `username not found for ${userIdentity}` },
        });
      }
      return Ok(username.Some);
    });
  }
}

const user = new User();
export default user;
