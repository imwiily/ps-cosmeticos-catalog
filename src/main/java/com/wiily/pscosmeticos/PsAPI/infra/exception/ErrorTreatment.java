package com.wiily.pscosmeticos.PsAPI.infra.exception;

import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.CategoryNotExist;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.ImageIsNull;
import com.wiily.pscosmeticos.PsAPI.domain.ApiResponse;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.ProductTypeNotExists;
import com.wiily.pscosmeticos.PsAPI.infra.exception.exceptions.SubCategoryNotBelongToCategory;
import jakarta.persistence.EntityNotFoundException;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.Arrays;

@RestControllerAdvice
public class ErrorTreatment {



    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> genericError(Exception e) {
        System.out.println(Arrays.toString(e.getStackTrace()));
        return ResponseEntity.internalServerError().body(new ApiResponse(false, e.getMessage()));
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<Object> fileUploadError(FileUploadException e){
        System.out.println(e.toString());
        return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));

    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Void> notFoundError(EntityNotFoundException e) {
        String s = e.getMessage();
        System.out.println(s);
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> argumentInvalid(MethodArgumentNotValidException e) {
        var errors = e.getFieldErrors();
        return ResponseEntity.badRequest().body(errors.stream().map(InvalidArgument::new));

    }
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Object> missingRequestPart(MissingServletRequestPartException e) {
        String s = String.valueOf(e.getBody());
        return ResponseEntity.badRequest().body(e.getRequestPartName() + " " + s);
    }
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse> missingRequestParameter(MissingServletRequestParameterException e) {
        var s = e.getParameterName();
        return ResponseEntity.badRequest().body(
                new ApiResponse(
                        false,
                        "RP.MISS",
                        "Request Parameter '" + s + "' is missing!"
                )
        );
    }
    @ExceptionHandler(SubCategoryNotBelongToCategory.class)
    public ResponseEntity<ApiResponse> subCategontNotBelong(SubCategoryNotBelongToCategory e) {
        return ResponseEntity.badRequest().body(
                new ApiResponse(
                        false,
                        e.getMessage()
                )
        );
    }
    @ExceptionHandler(ProductTypeNotExists.class)
    public ResponseEntity<ApiResponse> productTypeNotExist(ProductTypeNotExists e) {
        return ResponseEntity.badRequest().body(new ApiResponse(
                false,
                e.getMessage()
        ));
    }


    private record InvalidArgument(String camp, String desc) {
        public InvalidArgument(FieldError error) {
            this(error.getField(), error.getDefaultMessage());
        }
    }
//    private dto MissingRequestPartField(String camp, String idnt) {
//        public MissingRequestPartField()
//    }


    // Custom exceptions
    @ExceptionHandler(ImageIsNull.class)
    public ResponseEntity<ApiResponse> imageNullError(ImageIsNull e) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMap()));
    }
    @ExceptionHandler(CategoryNotExist.class)
    public ResponseEntity<ApiResponse> categoryNotExist(CategoryNotExist e) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMap()));
    }
}
