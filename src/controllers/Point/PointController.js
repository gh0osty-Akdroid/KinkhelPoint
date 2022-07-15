// const db = require('../../config/db');
// const Points = require('../../models/Points')
// const PointsDetails = require('../../models/PointsDetail');

// const transaction = await db.transaction

// const addPoints = async(req, res) =>{
//     const body = req.body   
//     try {
//         const points = await Points.build({
//             points :body.points,
//             user_id :body.user_id
//         } , {transaction})
//         const points_details = await PointsDetails.build({
//             point_id : points.isSoftDeleted,
//             points :body.points,
//             merchant_id :body.merchant_id,
//             user_transfer_id :body.user_id,
//             remarks: body.remarks,
//             token:body.token,
//             other:body.others
//         },{transaction})

//         transaction.afterCommit(() => {
//             points.save()
//             points_details.save()
//         })
//         transaction.commit()        
//     } catch (err) {
        
//     } 
// }



// const subPoints = async(req, res) =>{
//     const body = req.body
//     try {
        
//     } catch (err) {
        
//     }
// }