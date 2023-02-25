import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const studentsAdapter = createEntityAdapter({});

const initialState = studentsAdapter.getInitialState();

export const studentsApiSlice = apiSlice.injectEndpoints({
    endpoints : builder => ({
        getStudents: builder.query({
            query: () => ({
                url: "/students",
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => {
                const loadedStudents = responseData.map(student => {
                    student.id = student._id
                    return student
                });
                return studentsAdapter.setAll(initialState, loadedStudents)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Student', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Student', id }))
                    ]
                } else return [{ type: 'Student', id: 'LIST' }]
            }
        }),
        addNewStudent: builder.mutation({
            query: initialStudentData => ({
                url: "/students",
                method: "POST",
                body: {
                    ...initialStudentData,
                }
            }),
            invalidateTags: [
                {type: "Student", id: "LIST"}
            ]
        }),
        updateStudent: builder.mutation({
            query: initialStudentData => ({
                url: "/students",
                method: "PATCH",
                body: {
                    ...initialStudentData
                }
            }),
            invalidateTags: (result, error, arg) => [
                {type: "Student", id: arg.id}
            ]
        }),
        deleteStudent: builder.mutation({
            query: ({id}) => ({
                url: "/students",
                method: "DELETE",
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: "Student", id: arg.id}
            ]
        })
    })
})

export const {
    useGetStudentsQuery,
    useAddNewStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation
} = studentsApiSlice;

export const selectStudentsResult = studentsApiSlice.endpoints.getStudents.select();

const selectStudentsData = createSelector(
    selectStudentsResult,
    studentsResults => studentsResults.data 
);

export const {
    selectAll: selectAllStudents,
    selectById: selectStudentById,
    selectIds: selectStudentIds
} = studentsAdapter.getSelectors(state => selectStudentsData(state) ?? initialState)