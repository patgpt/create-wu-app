// /*
//  *
//  * Copyright (c) 2024.
//  * Author: Patrick Kelly
//  * Company: WithU Training
//  * /
//  *
//  */
//
// import { client } from "../src/client";
// import { CONFIG } from "../src/config";
// import {createOrUpdateContentModel} from "../src/create";
//
// jest.mock("../src/client");
//
// describe("createOrUpdateContentModel", () => {
//   const spaceId = CONFIG.spaceId;
//   const environmentId = CONFIG.environmentId;
//
//   const mockModelData = {
//     sys: { id: "testContentType" },
//     name: "Test Content Type",
//     fields: [],
//     description: "A test content type",
//     displayField: "name",
//   };
//
//   const mockEntryData = {
//     sys: { id: "testEntry" },
//     fields: { name: { "en-US": "Test Entry" } },
//   };
//
//   const mockAssets = {
//     profilePicture: {
//       title: "Test Asset",
//       fileName: "test-asset.jpg",
//       contentType: "image/jpeg",
//       url: "https://example.com/test-asset.jpg",
//     },
//   };
//
//   it("should create a new content type and entry successfully", async () => {
//     const mockSpace = {
//       getEnvironment: jest.fn().mockResolvedValue({
//         getContentType: jest.fn().mockRejectedValue(new Error("NotFound")),
//         createContentTypeWithId: jest.fn().mockResolvedValue({
//           publish: jest.fn().mockResolvedValue({}),
//         }),
//         createEntryWithId: jest.fn().mockResolvedValue({
//           publish: jest.fn().mockResolvedValue({}),
//         }),
//       }),
//     };
//
//     (client.getSpace as jest.Mock).mockResolvedValue(mockSpace);
//
//     await expect(
//       createOrUpdateContentModel(
//         spaceId,
//         environmentId,
//         mockModelData,
//         mockEntryData,
//         mockAssets,
//       ),
//     ).resolves.not.toThrow();
//
//     expect(mockSpace.getEnvironment).toHaveBeenCalledWith(environmentId);
//   });
//
//   it("should handle existing content type and update it", async () => {
//     const mockEnvironment = {
//       getContentType: jest.fn().mockResolvedValue({
//         update: jest.fn().mockResolvedValue({}),
//         publish: jest.fn().mockResolvedValue({}),
//       }),
//       createEntryWithId: jest.fn().mockResolvedValue({
//         publish: jest.fn().mockResolvedValue({}),
//       }),
//     };
//
//     const mockSpace = {
//       getEnvironment: jest.fn().mockResolvedValue(mockEnvironment),
//     };
//
//     (client.getSpace as jest.Mock).mockResolvedValue(mockSpace);
//
//     await expect(
//       createOrUpdateContentModel(
//         spaceId,
//         environmentId,
//         mockModelData,
//         mockEntryData,
//         mockAssets,
//       ),
//     ).resolves.not.toThrow();
//
//     expect(mockEnvironment.getContentType).toHaveBeenCalledWith(
//       mockModelData.sys.id,
//     );
//   });
// });
