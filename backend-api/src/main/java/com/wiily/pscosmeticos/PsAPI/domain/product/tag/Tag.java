package com.wiily.pscosmeticos.PsAPI.domain.product.tag;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name =  "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    Long id;

    @Column(name = "tag_name")
    String name;

    public Tag(String tag) {
        name = tag;
    }

    @Override
    public String toString() {
        return name;
    }
}
